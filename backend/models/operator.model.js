import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    operatorCode: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    // company
    company: {
        companyName: { type: String },
        brandName: { type: String },
        // file metadata for logo (keeps logoUrl for backward compatibility)
        logo: {
            originalName: { type: String },
            fileUrl: { type: String }
        },
        logoUrl: { type: String },
        description: { type: String },
        yearEstablished: { type: Number }
    },
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
    contactInfo: {
        primaryContactName: { type: String },
        designation: { type: String },
        officePhone: { type: String },
        mobileNumber: { type: String },
        email: { type: String, lowercase: true, trim: true },
        website: { type: String },
        customerSupportContact: { type: String }
    },
    // legal
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
        businessLicenses: [
            {
                name: { type: String },
                fileUrl: { type: String },
                issuedBy: { type: String },
                issuedDate: { type: Date },
                expiryDate: { type: Date }
            }
        ]
    },
    certifications: [
        {
            name: { type: String },
            certificateUrl: { type: String },
            validFrom: { type: Date },
            validTo: { type: Date }
        }
    ],
    insurance: {
        provider: { type: String },
        policyNumber: { type: String },
        coverageDetails: { type: String },
        policyDocumentUrl: { type: String },
        validFrom: { type: Date },
        validTo: { type: Date }
    },
    regulatory: {
        dgcaAirAmbulanceApproval: { type: Boolean, default: false },
        nsopNumber: { type: String },
        airworthinessCertificateValidity: { type: Date },
        maintenanceOrganizationApproval: { type: String },
        safetyManagementSystem: { type: Boolean, default: false },
        emergencyEquipment: [
            { type: String }
        ],
        dgcaComplianceNotes: { type: String }
    },
    maintenance: {
        lastCheck: { type: Date },
        nextDue: { type: Date },
        statusNotes: { type: String },
        maintenanceRecords: [
            {
                date: { type: Date },
                performedBy: { type: String },
                notes: { type: String },
                documentUrl: { type: String }
            }
        ]
    },
    notes: { type: String },
    attachments: [
        {
            label: { type: String },
            url: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        }
    ],
    // Finance
    finance: {
        bankName: { type: String },               // 1. Bank Name
        branchAddress: { type: String },          // 2. Branch Address
        accountNumber: { type: String },          // 3. Account Number / IBAN (merged)
        swiftIfsc: { type: String },              // 4. SWIFT / IFSC Code
        paymentMethodsAccepted: [ { type: String } ], // 5. Payment Methods Accepted (multi-select)
        accountHolderName: { type: String },      // 6. account holder name
        billingAddress: { type: String }          // 7. billing address
    },
    // Documents
    documents: {
        businessLicenses: [ // 1. Business License → File Upload (supports multiple)
            {
                originalName: { type: String },
                fileUrl: { type: String },
                uploadedAt: { type: Date, default: Date.now },
                notes: { type: String }
            }
        ],
        taxCertificates: [ // 2. Tax Certificate → File Upload
            {
                originalName: { type: String },
                fileUrl: { type: String },
                uploadedAt: { type: Date, default: Date.now },
                notes: { type: String }
            }
        ],
        insuranceCertificates: [ // 3. Insurance Certificate → File Upload
            {
                originalName: { type: String },
                fileUrl: { type: String },
                uploadedAt: { type: Date, default: Date.now },
                notes: { type: String }
            }
        ],
        identityProofs: [ // 4. Identity Proof → File Upload
            {
                typeOfId: { type: String },
                originalName: { type: String },
                fileUrl: { type: String },
                uploadedAt: { type: Date, default: Date.now }
            }
        ],
        addressProofs: [ // 5. Address Proof → File Upload
            {
                originalName: { type: String },
                fileUrl: { type: String },
                uploadedAt: { type: Date, default: Date.now }
            }
        ],
        religiousApprovals: [ // 6. Religious Approvals → File Upload
            {
                name: { type: String },
                originalName: { type: String },
                fileUrl: { type: String },
                uploadedAt: { type: Date, default: Date.now }
            }
        ],
        nsopAopCertificates: [ // 7. NSOP / AOP Certificate
            {
                originalName: { type: String },
                fileUrl: { type: String },
                issuedDate: { type: Date },
                expiryDate: { type: Date }
            }
        ],
        dgcaComplianceDocs: [ // 8. DGCA compliance doc
            {
                originalName: { type: String },
                fileUrl: { type: String },
                uploadedAt: { type: Date, default: Date.now },
                notes: { type: String }
            }
        ]
    },
    // extras
    socialMedia: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        youtube: { type: String },
        other: [{ type: String }]
    },
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
    testimonials: [
        {
            author: { type: String },   // person/company giving testimonial
            role: { type: String },     // optional role or relation
            content: { type: String },  // multi-line testimonial text
            date: { type: Date }
        }
    ],
    pastExperience: { type: String }, // multi-line free text for past projects / experience
    preferredCommunicationChannel: {
        type: String,
        enum: ["whatsapp", "email", "phone", "other"],
        default: "whatsapp"
    },
    notesForAdmin: { type: String } // admin-specific notes / internal comments
}, { timestamps: true });

const OperatorModel = mongoose.model("Operator", operatorSchema);

export default OperatorModel;