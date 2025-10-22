import OperatorModel from "../models/operator.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// ---------------- new imports used by upload/delete handlers ----------------
import multer from "multer";
import path from "path";
import fs from "fs";

// Helper to generate JWT token for a user
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '7d'});
};

export async function signup(req, res) {
    try {
        const {email, password} = req.body;

        // Trim inputs and validate
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
        if (!passwordRegex.test(trimmedPassword)) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
        });
        }

        // Check if operator already exists
        const operatorExists = await OperatorModel.findOne({ email: trimmedEmail });
        if (operatorExists) {
        return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password and create operator
        const hashed = await bcrypt.hash(trimmedPassword, 10);
        const operator = await OperatorModel.create({
            email: trimmedEmail,
            password: hashed,
        });

        // Respond with operator info and JWT token
        res.status(201).json({
            _id: operator._id,
            email: operator.email,
            token: generateToken(operator._id)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find operator by email
        const operator = await OperatorModel.findOne({ email });
        if (!operator) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const match = await bcrypt.compare(password, operator.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // Respond with operator info and JWT token
        res.json({
            _id: operator._id,
            email: operator.email,
            token: generateToken(operator._id)
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
}

// Helper to get operatorId from request (Authorization header or req.body.operatorId)
function getOperatorIdFromReq(req) {
	// Try middleware-populated value first
	if (req.operatorId) return req.operatorId;
	// Try token in Authorization header
	const auth = req.headers?.authorization || req.headers?.Authorization;
	if (!auth) return null;
	const parts = auth.split(" ");
	if (parts.length !== 2) return null;
	const token = parts[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		return decoded?.id || decoded?.userId || null;
	} catch (err) {
		return null;
	}
}

// multer storage that places files under uploads/operators/<operatorId>.
// We create the upload middleware after getOperatorIdFromReq so we can use it.
const baseUploadDir = path.join(process.cwd(), "uploads", "operators");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const operatorId = getOperatorIdFromReq(req) || req.body.operatorId || "anonymous";
		const dest = path.join(baseUploadDir, operatorId.toString());
		fs.mkdirSync(dest, { recursive: true });
		cb(null, dest);
	},
	filename: function (req, file, cb) {
		const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
		cb(null, safe);
	}
});
const uploadMiddleware = multer({ storage });

// Normalize simple document arrays like [{name}] into FileMeta entries
function normalizeDocumentArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map((d) => {
        if (!d) return null;
        // if already has fileUrl/originalName, keep minimal fields
        if (d.originalName || d.fileUrl) {
            return {
                originalName: d.originalName || d.name || "",
                fileUrl: d.fileUrl || "",
                mimeType: d.mimeType || "",
                size: d.size || 0,
                uploadedAt: d.uploadedAt || Date.now(),
                notes: d.notes || ""
            };
        }
        return {
            originalName: d.name || d.originalName || "",
            fileUrl: d.fileUrl || "",
            mimeType: d.type || "",
            size: d.size || 0,
            uploadedAt: Date.now(),
            notes: ""
        };
    }).filter(Boolean);
}

// GET operator profile (for the logged-in operator)
export async function getOperatorProfile(req, res) {
    try {
        const operatorId = getOperatorIdFromReq(req) || req.query.operatorId || req.params.id;
        if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

        const op = await OperatorModel.findById(operatorId).lean();
        if (!op) return res.status(404).json({ message: "Operator not found" });

        res.json(op);
    } catch (err) {
        console.error("getOperatorProfile:", err);
        res.status(500).json({ message: "Server Error" });
    }
}

// POST / PUT to save operator company/profile data
export async function saveOperatorProfile(req, res) {
    try {
        const operatorId = getOperatorIdFromReq(req) || req.body.operatorId;
        if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

        const payload = req.body || {};

        // Destructure possible fields (frontend sends many nested objects)
        const {
            company,
            location,
            contactInfo,
            businessInfo,
            insurance: insPayload,
            regulatory: regPayload,
            maintenance,
            finance,
            documents: docsPayload,
            pressReleases: prPayload,
            extras
        } = payload;

        // Build update object carefully, only including provided sections
        const update = {};

        if (company) {
            update.company = {
                ...company
            };
            // If logo provided as metadata name only, keep as-is; otherwise backend file uploads should populate fileUrl
            if (company.logo && company.logo.name && !company.logo.fileUrl) {
                update.company.logo = {
                    originalName: company.logo.name,
                    fileUrl: company.logo.fileUrl || ""
                };
            }
        }

        if (location) update.location = location;
        if (contactInfo) update.contactInfo = contactInfo;
        if (businessInfo) update.businessInfo = businessInfo;

        // Normalize insurance: support both flat flags and structured coverages
        if (insPayload) {
            const insuranceObj = {
                provider: insPayload.provider || "",
                policyNumber: insPayload.policyNumber || "",
                validFrom: insPayload.validFrom || null,
                validTo: insPayload.validTo || null,
                coverages: {
                    aircraft: { enabled: false, policyNumber: "" },
                    thirdParty: { enabled: false, policyNumber: "" },
                    patientLiability: { enabled: false, policyNumber: "" }
                }
            };

            // flat flags mapping (frontend uses hasAircraftInsurance etc.)
            if (typeof insPayload.hasAircraftInsurance !== "undefined") {
                insuranceObj.coverages.aircraft.enabled = !!insPayload.hasAircraftInsurance;
                insuranceObj.coverages.aircraft.policyNumber = insPayload.policyAircraftNumber || "";
            }
            if (typeof insPayload.hasThirdPartyInsurance !== "undefined") {
                insuranceObj.coverages.thirdParty.enabled = !!insPayload.hasThirdPartyInsurance;
                insuranceObj.coverages.thirdParty.policyNumber = insPayload.policyThirdPartyNumber || "";
            }
            if (typeof insPayload.hasPatientLiabilityInsurance !== "undefined") {
                insuranceObj.coverages.patientLiability.enabled = !!insPayload.hasPatientLiabilityInsurance;
                insuranceObj.coverages.patientLiability.policyNumber = insPayload.policyPatientLiabilityNumber || "";
            }

            // If incoming already has coverages object, merge gently
            if (insPayload.coverages) {
                insuranceObj.coverages = {
                    ...insuranceObj.coverages,
                    ...insPayload.coverages
                };
            }

            update.insurance = insuranceObj;
        }

        // Regulatory: ensure emergencyEquipment array
        if (regPayload) {
            const regObj = { ...regPayload };
            if (regPayload.emergencyEquipment && !Array.isArray(regPayload.emergencyEquipment)) {
                // Try to parse comma separated string
                regObj.emergencyEquipment = String(regPayload.emergencyEquipment).split(",").map(s => s.trim()).filter(Boolean);
            }
            update.regulatory = regObj;
        }

        // Maintenance: store as provided
        if (maintenance) update.maintenance = maintenance;

        if (finance) update.finance = finance;

        // Documents: map each simple {name} to FileMeta-like object
        if (docsPayload) {
            const docs = {};
            const keys = ["businessLicenses","taxCertificates","insuranceCertificates","identityProofs","addressProofs","religiousApprovals","nsopAopCertificates","dgcaComplianceDocs"];
            for (const k of keys) {
                if (Array.isArray(docsPayload[k])) {
                    docs[k] = normalizeDocumentArray(docsPayload[k]);
                }
            }
            update.documents = { ...(Object.keys(docs).length ? docs : {}) };
        }

        // Press releases: map incoming names -> minimal file records (or keep full payload)
        if (Array.isArray(prPayload)) {
            update.pressReleases = prPayload.map(p => ({
                title: p.title || "",
                originalName: p.name || p.originalName || "",
                fileUrl: p.fileUrl || "",
                publishedAt: p.publishedAt || null,
                uploadedAt: p.uploadedAt || Date.now(),
                notes: p.notes || ""
            }));
        }

        if (extras) update.extras = extras || update.extras;

        // Apply update
        const opts = { new: true, setDefaultsOnInsert: true };
        const updated = await OperatorModel.findByIdAndUpdate(operatorId, { $set: update }, opts).lean();

        if (!updated) return res.status(404).json({ message: "Operator not found" });

        return res.json({ message: "Saved", operator: updated });
    } catch (err) {
        console.error("saveOperatorProfile:", err);
        return res.status(500).json({ message: "Failed to save operator profile" });
    }
}

// ---------------- New: upload / delete document controllers ----------------

// POST /operator/upload  (multipart/form-data) fields:
// - files: file inputs (multiple)
// - group: document group name (e.g. businessLicenses or "logo" for company logo)
// Returns metadata for saved files.
export async function uploadOperatorDocuments(req, res) {
	uploadMiddleware.array("files")(req, res, async function (err) {
		if (err) {
			console.error("uploadOperatorDocuments (multer):", err);
			return res.status(500).json({ message: "File upload failed" });
		}
		try {
			const operatorId = getOperatorIdFromReq(req) || req.body.operatorId;
			if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

			const group = req.body.group;
			if (!group) return res.status(400).json({ message: "Missing document group" });

			const files = (req.files || []).map((f) => ({
				originalName: f.originalname,
				fileUrl: path.posix.join("/uploads/operators", operatorId.toString(), path.basename(f.path)),
				mimeType: f.mimetype,
				size: f.size,
				uploadedAt: new Date()
			}));

			// Update operator document
			const op = await OperatorModel.findById(operatorId);
			if (!op) return res.status(404).json({ message: "Operator not found" });

			// Special-case for logo: store metadata in company.logo
			if (group === "logo" || group === "companyLogo") {
				// take first file only
				const f = files[0];
				op.company = op.company || {};
				op.company.logo = {
					originalName: f.originalName,
					fileUrl: f.fileUrl,
					mimeType: f.mimeType,
					size: f.size
				};
				await op.save();
				return res.json({ message: "Uploaded", files: [op.company.logo] });
			}

			// Generic groups under documents
			op.documents = op.documents || {};
			op.documents[group] = op.documents[group] || [];
			op.documents[group].push(...files);
			await op.save();

			return res.json({ message: "Uploaded", files });
		} catch (e) {
			console.error("uploadOperatorDocuments:", e);
			return res.status(500).json({ message: "Failed to save uploaded files" });
		}
	});
}

// DELETE /operator/document  (JSON) body: { group, fileUrl }
// Deletes metadata and disk file if present.
export async function deleteOperatorDocument(req, res) {
	try {
		const operatorId = getOperatorIdFromReq(req) || req.body.operatorId;
		if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

		const { group, fileUrl } = req.body;
		if (!group || !fileUrl) return res.status(400).json({ message: "Missing group or fileUrl" });

		const op = await OperatorModel.findById(operatorId);
		if (!op) return res.status(404).json({ message: "Operator not found" });

		// Logo deletion
		if (group === "logo" || group === "companyLogo") {
			const prev = op.company?.logo;
			op.company = op.company || {};
			op.company.logo = undefined;
			await op.save();

			// remove physical file if exists
			try {
				const rel = (prev?.fileUrl || "").replace(/^\//, "");
				const abs = path.join(process.cwd(), rel);
				if (fs.existsSync(abs)) fs.unlinkSync(abs);
			} catch (fsErr) {
				console.warn("deleteOperatorDocument (logo) fs remove error", fsErr);
			}
			return res.json({ message: "Deleted", removed: prev });
		}

		// Generic documents
		const arr = op.documents?.[group] || [];
		const idx = arr.findIndex((f) => f.fileUrl === fileUrl || f.originalName === fileUrl);
		if (idx === -1) return res.status(404).json({ message: "File metadata not found" });

		const [removed] = arr.splice(idx, 1);
		op.markModified(`documents.${group}`);
		await op.save();

		try {
			const rel = (removed.fileUrl || "").replace(/^\//, "");
			const abs = path.join(process.cwd(), rel);
			if (fs.existsSync(abs)) fs.unlinkSync(abs);
		} catch (fsErr) {
			console.warn("deleteOperatorDocument fs remove error", fsErr);
		}

		return res.json({ message: "Deleted", removed });
	} catch (err) {
		console.error("deleteOperatorDocument:", err);
		return res.status(500).json({ message: "Failed to delete document" });
	}
}
