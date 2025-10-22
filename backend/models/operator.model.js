import mongoose from "mongoose";

// Small reusable file metadata sub-schema
const FileMeta = {
	originalName: { type: String },
	fileUrl: { type: String },
	mimeType: { type: String },
	size: { type: Number },
	uploadedAt: { type: Date, default: Date.now },
	notes: { type: String }
};

const operatorSchema = new mongoose.Schema({
	// Auth / basic
	email: { type: String, required: true, unique: true, lowercase: true, trim: true },
	password: { type: String, required: true },
	operatorCode: { type: String, unique: true, sparse: true },
	name: { type: String },
	phone: { type: String },

	// Company summary
	company: {
		companyName: { type: String },
		brandName: { type: String },
		// Logo file metadata and legacy url for backward compatibility
		logo: {
			originalName: { type: String },
			fileUrl: { type: String },
			mimeType: { type: String },
			size: { type: Number }
		},
		logoUrl: { type: String }, // legacy
		description: { type: String },
		yearEstablished: { type: Number }
	},

	// Location
	location: {
		headquartersAddress: { type: String },
		branches: [
			{
				label: { type: String },
				address: { type: String }
			}
		],
		city: { type: String },
		state: { type: String },
		country: { type: String },
		postalCode: { type: String },
		locationLink: { type: String }
	},

	// Contact
	contactInfo: {
		primaryContactName: { type: String },
		designation: { type: String },
		officePhone: { type: String },
		mobileNumber: { type: String },
		email: { type: String, lowercase: true, trim: true },
		website: { type: String },
		customerSupportContact: { type: String }
	},

	// Business / legal
	businessInfo: {
		registrationNumber: { type: String },
		taxId: { type: String },
		countryOfIncorporation: { type: String },
		businessType: {
			type: String,
			enum: [
				"Private Limited",
				"Partnership",
				"Proprietorship",
				"Trust",
				"LLP",
				"Public Limited",
				"Other"
			],
			default: "Private Limited"
		},
		// Keep metadata entries if required; files themselves live under documents.businessLicenses
		businessLicenses: [
			{
				name: { type: String },
				issuedBy: { type: String },
				issuedDate: { type: Date },
				expiryDate: { type: Date },
				notes: { type: String }
			}
		]
	},

	// Insurance: keep primary fields and structured coverage details
	insurance: {
		provider: { type: String },
		policyNumber: { type: String },
		validFrom: { type: Date },
		validTo: { type: Date },
		coverages: {
			aircraft: {
				enabled: { type: Boolean, default: false },
				policyNumber: { type: String }
			},
			thirdParty: {
				enabled: { type: Boolean, default: false },
				policyNumber: { type: String }
			},
			patientLiability: {
				enabled: { type: Boolean, default: false },
				policyNumber: { type: String }
			}
		},
		// If you later want to store uploaded policy documents, use documents.insuranceCertificates
	},

	// Regulatory & safety
	regulatory: {
		dgcaAirAmbulanceApproval: { type: Boolean, default: false },
		nsopNumber: { type: String },
		airworthinessCertificateValidity: { type: Date },
		maintenanceOrganizationApproval: { type: String },
		safetyManagementSystem: { type: Boolean, default: false },
		emergencyEquipment: [{ type: String }] // array of strings
		// dgcaComplianceNotes removed to avoid redundancy (use documents/dedicated notes instead)
	},

	// Maintenance logs
	maintenance: {
		lastCheck: { type: Date },
		nextDue: { type: Date },
		statusNotes: { type: String },
		maintenanceRecords: [
			{
				date: { type: Date },
				performedBy: { type: String },
				notes: { type: String },
				// If document uploaded, reference file metadata
				document: {
					originalName: { type: String },
					fileUrl: { type: String },
					uploadedAt: { type: Date }
				}
			}
		]
	},

	// Finance: merged accountNumber / IBAN, no billingCurrency
	finance: {
		bankName: { type: String },
		branchAddress: { type: String },
		accountNumber: { type: String }, // Account Number / IBAN
		swiftIfsc: { type: String },
		paymentMethodsAccepted: [{ type: String }],
		accountHolderName: { type: String },
		billingAddress: { type: String }
	},

	// Documents: consistent file metadata arrays
	documents: {
		businessLicenses: [ FileMeta ],
		taxCertificates: [ FileMeta ],
		insuranceCertificates: [ FileMeta ],
		identityProofs: [
			{
				typeOfId: { type: String },
				originalName: { type: String },
				fileUrl: { type: String },
				uploadedAt: { type: Date, default: Date.now }
			}
		],
		addressProofs: [ FileMeta ],
		religiousApprovals: [ FileMeta ],
		nsopAopCertificates: [
			{
				originalName: { type: String },
				fileUrl: { type: String },
				issuedDate: { type: Date },
				expiryDate: { type: Date },
				uploadedAt: { type: Date, default: Date.now }
			}
		],
		dgcaComplianceDocs: [ FileMeta ]
	},

	// Press releases (kept)
	pressReleases: [
		{
			title: { type: String },
			originalName: { type: String },
			fileUrl: { type: String },
			publishedAt: { type: Date },
			uploadedAt: { type: Date, default: Date.now },
			notes: { type: String }
		}
	],

	// Extras
	socialMedia: {
		facebook: { type: String },
		instagram: { type: String },
		twitter: { type: String },
		linkedin: { type: String },
		youtube: { type: String },
		other: [{ type: String }]
	},
	testimonials: [
		{
			author: { type: String },
			role: { type: String },
			content: { type: String },
			date: { type: Date }
		}
	],
	pastExperience: { type: String },
	preferredCommunicationChannel: {
		type: String,
		enum: ["whatsapp", "email", "phone", "other"],
		default: "whatsapp"
	},
	notesForAdmin: { type: String },

	// Internal notes / generic free text
	notes: { type: String }

}, { timestamps: true });

// Indexes: email unique already, consider compound or text indexes as needed later
const OperatorModel = mongoose.model("Operator", operatorSchema);

export default OperatorModel;