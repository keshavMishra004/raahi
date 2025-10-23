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
            // Don't replace entire company object (would remove nested logo). Set individual company fields.
            const { logo: logoPayload, ...companyRest } = company;
            for (const [k, v] of Object.entries(companyRest)) {
                update[`company.${k}`] = v;
            }

            // Only update logo metadata when payload includes a real uploaded asset (fileUrl or publicId).
            // If frontend sends only { name: "..." } we intentionally skip updating logo to preserve existing asset.
            if (Object.prototype.hasOwnProperty.call(company, "logo")) {
                if (logoPayload && (logoPayload.fileUrl || logoPayload.publicId)) {
                    update[`company.logo`] = {
                        originalName: logoPayload.originalName || logoPayload.name || "",
                        fileUrl: logoPayload.fileUrl || "",
                        publicId: logoPayload.publicId || undefined,
                        mimeType: logoPayload.mimeType || "",
                        size: logoPayload.size || 0
                    };
                }
                // explicit removal (logo: null) is not handled here — use DELETE /operator/document to remove assets.
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

// ---------------- Updated: upload / delete document controllers ----------------

// POST /operator/upload  (multipart/form-data) fields:
// - files: file inputs (multiple)
// - group: document group name (e.g. businessLicenses or "logo" for company logo)
// Returns cloudinary metadata for saved files OR local file metadata if cloudinary is not available.
export async function uploadOperatorDocuments(req, res) {
	uploadMiddleware.array("files")(req, res, async function (err) {
		if (err) {
			console.error("uploadOperatorDocuments (multer):", err);
			return res.status(500).json({ message: "File upload failed" });
		}
		try {
			const operatorId = getOperatorIdFromReq(req) || req.body.operatorId;
			if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

			// debug: show what multipart parser produced (helps diagnose missing fields)
			console.debug("uploadOperatorDocuments - req.body keys:", Object.keys(req.body || {}));
			console.debug("uploadOperatorDocuments - req.query:", req.query || {});
			console.debug("uploadOperatorDocuments - req.headers['x-upload-group']:", req.headers['x-upload-group']);
			console.debug("uploadOperatorDocuments - req.files length:", (req.files || []).length);

			// Accept group from multiple places to be resilient to client differences:
			const group = (req.body && req.body.group) || req.query?.group || req.headers['x-upload-group'];
			if (!group) {
				console.warn("uploadOperatorDocuments: missing group. req.body keys:", Object.keys(req.body || {}));
				return res.status(400).json({ message: "Missing document group. Include 'group' in form-data, query (?group=) or header 'X-Upload-Group'." });
			}

			// Ensure files were parsed by multer
			if (!req.files || req.files.length === 0) {
				console.warn("uploadOperatorDocuments: no files received by multer. Ensure the multipart field name is 'files' and Content-Type is multipart/form-data.");
				return res.status(400).json({ message: "No files received. Make sure request is multipart/form-data and field name is 'files'." });
			}

			// Try to dynamically load cloudinary. If unavailable, we'll fallback to local file URLs.
			let cloudinary = null;
			try {
				const mod = await import("cloudinary");
				cloudinary = mod?.v2 || null;
				if (cloudinary) {
					cloudinary.config({
						cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
						api_key: process.env.CLOUDINARY_API_KEY,
						api_secret: process.env.CLOUDINARY_API_SECRET,
						secure: true
					});
				}
			} catch (impErr) {
				// cloudinary not installed or failed to import — proceed with local file handling
				cloudinary = null;
			}

			const uploadedFiles = [];

			for (const f of (req.files || [])) {
				if (cloudinary) {
					// Upload to Cloudinary and remove local temp file
					try {
						const folder = `operators/${operatorId}/${group}`;
						const result = await cloudinary.uploader.upload(f.path, {
							folder,
							use_filename: true,
							unique_filename: false,
							resource_type: "auto"
						});
						uploadedFiles.push({
							originalName: f.originalname,
							fileUrl: result.secure_url,
							publicId: result.public_id,
							mimeType: f.mimetype,
							size: f.size,
							uploadedAt: new Date()
						});
					} catch (uploadErr) {
						console.error("cloudinary upload error for file:", f.path, uploadErr);
						// fall back to local metadata if cloudinary upload fails
						const localUrl = path.posix.join("/uploads/operators", operatorId.toString(), path.basename(f.path));
						uploadedFiles.push({
							originalName: f.originalname,
							fileUrl: localUrl,
							mimeType: f.mimetype,
							size: f.size,
							uploadedAt: new Date()
						});
					} finally {
						// cleanup local temp file if still present
						try { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
					}
				} else {
					// Cloudinary not available: keep local file path (multer already saved file)
					const localUrl = path.posix.join("/uploads/operators", operatorId.toString(), path.basename(f.path));
					uploadedFiles.push({
						originalName: f.originalname,
						fileUrl: localUrl,
						mimeType: f.mimetype,
						size: f.size,
						uploadedAt: new Date()
					});
					// Do not remove local file here; it's the persistent file location
				}
			}

			const op = await OperatorModel.findById(operatorId);
			if (!op) return res.status(404).json({ message: "Operator not found" });

			// Logo: save first file metadata under company.logo
			if (group === "logo" || group === "companyLogo") {
				const f = uploadedFiles[0];
				if (!f) return res.status(400).json({ message: "No file uploaded" });
				op.company = op.company || {};
				op.company.logo = {
					originalName: f.originalName,
					fileUrl: f.fileUrl,
					publicId: f.publicId, // may be undefined if local
					mimeType: f.mimeType,
					size: f.size
				};
				await op.save();
				return res.json({ message: "Uploaded", files: [op.company.logo] });
			}

			// Generic documents
			op.documents = op.documents || {};
			op.documents[group] = op.documents[group] || [];
			op.documents[group].push(...uploadedFiles.map(f => ({
				originalName: f.originalName,
				fileUrl: f.fileUrl,
				publicId: f.publicId,
				mimeType: f.mimeType,
				size: f.size,
				uploadedAt: f.uploadedAt
			})));
			await op.save();

			return res.json({ message: "Uploaded", files: uploadedFiles });
		} catch (e) {
			console.error("uploadOperatorDocuments:", e);
			return res.status(500).json({ message: "Failed to save uploaded files" });
		}
	});
}

// DELETE /operator/document  (JSON) body: { group, fileUrl }
// Deletes metadata and Cloudinary asset (if publicId present) or local file if used.
export async function deleteOperatorDocument(req, res) {
	try {
		const operatorId = getOperatorIdFromReq(req) || req.body.operatorId;
		if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

		const { group, fileUrl } = req.body;
		if (!group || !fileUrl) return res.status(400).json({ message: "Missing group or fileUrl" });

		const op = await OperatorModel.findById(operatorId);
		if (!op) return res.status(404).json({ message: "Operator not found" });

		// Try to dynamically load cloudinary (if available)
		let cloudinary = null;
		try {
			const mod = await import("cloudinary");
			cloudinary = mod?.v2 || null;
			if (cloudinary) {
				cloudinary.config({
					cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
					api_key: process.env.CLOUDINARY_API_KEY,
					api_secret: process.env.CLOUDINARY_API_SECRET,
					secure: true
				});
			}
		} catch (impErr) {
			cloudinary = null;
		}

		// Logo deletion
		if (group === "logo" || group === "companyLogo") {
			const prev = op.company?.logo;
			op.company = op.company || {};
			op.company.logo = undefined;
			await op.save();

			// remove cloudinary asset if publicId present and cloudinary available
			try {
				const publicId = prev?.publicId;
				if (publicId && cloudinary) {
					await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
				} else {
					// fallback: remove local file if fileUrl points to uploads folder
					const rel = (prev?.fileUrl || "").replace(/^\//, "");
					const abs = path.join(process.cwd(), rel);
					if (fs.existsSync(abs)) fs.unlinkSync(abs);
				}
			} catch (cloudErr) {
				console.warn("deleteOperatorDocument (logo) remove error", cloudErr);
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

		// remove Cloudinary asset if publicId present, otherwise remove local file
		try {
			const publicId = removed?.publicId;
			if (publicId && cloudinary) {
				await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
			} else {
				const rel = (removed.fileUrl || "").replace(/^\//, "");
				const abs = path.join(process.cwd(), rel);
				if (fs.existsSync(abs)) fs.unlinkSync(abs);
			}
		} catch (cloudErr) {
			console.warn("deleteOperatorDocument remove error", cloudErr);
		}

		return res.json({ message: "Deleted", removed });
	} catch (err) {
		console.error("deleteOperatorDocument:", err);
		return res.status(500).json({ message: "Failed to delete document" });
	}
}

// ---------------- New: Cloudinary diagnostic endpoint ----------------
// GET /operator/cloudinary/test
export async function testCloudinary(req, res) {
	try {
		// dynamic import so server doesn't crash if package missing
		let cloudinary = null;
		try {
			const mod = await import("cloudinary");
			cloudinary = mod?.v2 || null;
		} catch (impErr) {
			return res.status(500).json({ ok: false, message: "cloudinary package not installed on backend", detail: String(impErr) });
		}

		if (!cloudinary) return res.status(500).json({ ok: false, message: "failed to load cloudinary module" });

		// Configure with env vars
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET,
			secure: true
		});

		// Call admin API to list resources (small call to validate credentials)
		try {
			const result = await cloudinary.api.resources({ max_results: 1 });
			return res.json({
				ok: true,
				message: "Cloudinary credentials are valid",
				summary: {
					resourcesReturned: Array.isArray(result.resources) ? result.resources.length : 0,
					total_count: result.total_count || null
				},
				sampleResource: result.resources?.[0] || null
			});
		} catch (apiErr) {
			console.error("Cloudinary API error:", apiErr);
			return res.status(400).json({ ok: false, message: "Cloudinary API error", detail: apiErr?.message || String(apiErr) });
		}
	} catch (err) {
		console.error("testCloudinary:", err);
		return res.status(500).json({ ok: false, message: "Internal server error", detail: String(err) });
	}
}
