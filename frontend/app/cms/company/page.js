"use client";
import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TABS = ["Basic", "Legal", "Finance", "Documents", "Extras"];

export default function CompanyPage() {
	const [activeTab, setActiveTab] = useState(0);
	const [saving, setSaving] = useState(false);

	// Basic company
	const [company, setCompany] = useState({
		companyName: "",
		brandName: "",
		logo: null, // replaced logoUrl with logo (File or null)
		description: "",
		yearEstablished: "",
	});

	// Location & contact
	const [location, setLocation] = useState({
		headquartersAddress: "",
		branches: [],
		city: "",
		state: "",
		country: "",
		postalCode: "",
		locationLink: "",
	});

	const [contactInfo, setContactInfo] = useState({
		primaryContactName: "",
		designation: "",
		officePhone: "",
		mobileNumber: "",
		email: "",
		website: "",
		customerSupportContact: "",
	});

	// Legal / Business
	const [businessInfo, setBusinessInfo] = useState({
		registrationNumber: "",
		taxId: "",
		countryOfIncorporation: "",
		businessType: "Private Limited",
		businessLicenses: [],
	});

	// insurance, regulatory, maintenance (certifications removed)
	const [insurance, setInsurance] = useState({
		provider: "",
		policyNumber: "",
		validFrom: "",
		validTo: "",
		// specific coverage flags / policy numbers
		hasAircraftInsurance: false,
		hasThirdPartyInsurance: false,
		hasPatientLiabilityInsurance: false,
		policyAircraftNumber: "",
		policyThirdPartyNumber: "",
		policyPatientLiabilityNumber: "",
	});
	const [regulatory, setRegulatory] = useState({
		dgcaAirAmbulanceApproval: false,
		nsopNumber: "",
		airworthinessCertificateValidity: "",
		maintenanceOrganizationApproval: "",
		safetyManagementSystem: false,
		emergencyEquipment: "", // comma-separated
	});

	// Finance
	const [finance, setFinance] = useState({
		bankName: "",
		branchAddress: "",
		accountNumber: "", // now holds "Account Number / IBAN"
		swiftIfsc: "",
		paymentMethodsAccepted: [],
		accountHolderName: "",
		billingAddress: "",
	});

	// Documents & attachments
	const [documents, setDocuments] = useState({
		businessLicenses: [],
		taxCertificates: [],
		insuranceCertificates: [],
		identityProofs: [],
		addressProofs: [],
		religiousApprovals: [],
		nsopAopCertificates: [],
		dgcaComplianceDocs: [],
	});

	const [pressReleases, setPressReleases] = useState([]);

	// Extras
	const [extras, setExtras] = useState({
		socialMedia: {
			facebook: "",
			instagram: "",
			twitter: "",
			linkedin: "",
			youtube: "",
			other: [],
		},
		testimonials: [], // { author, role, content, date }
		pastExperience: "",
		preferredCommunicationChannel: "whatsapp",
		notesForAdmin: "",
	});

	// preview URL for selected logo file (was missing; required by useEffect and UI)
	const [logoPreview, setLogoPreview] = useState(null);

	// Add predefined certifications options and selected state
	const CERT_OPTIONS = ["IATA", "DGCA", "FAA", "ISO", "Other"];
	const [certificationsSelected, setCertificationsSelected] = useState([]);

	// ---------------- Helpers ----------------
	const updateCompany = (field, value) => setCompany((p) => ({ ...p, [field]: value }));
	const updateLocation = (field, value) => setLocation((p) => ({ ...p, [field]: value }));
	const addBranch = () => setLocation((p) => ({ ...p, branches: [...p.branches, { label: "", address: "" }] }));
	const updateBranch = (idx, field, value) =>
		setLocation((p) => { const arr = [...p.branches]; arr[idx] = { ...arr[idx], [field]: value }; return { ...p, branches: arr }; });
	const removeBranch = (idx) => setLocation((p) => ({ ...p, branches: p.branches.filter((_, i) => i !== idx) }));

	const updateContact = (field, value) => setContactInfo((p) => ({ ...p, [field]: value }));
	const updateBusinessInfo = (field, value) => setBusinessInfo((p) => ({ ...p, [field]: value }));

	// business license helpers
	const addBusinessLicenseEntry = () => setBusinessInfo((p) => ({ ...p, businessLicenses: [...p.businessLicenses, { name: "", issuedBy: "", issuedDate: "", expiryDate: "" }] }));
	const updateBusinessLicense = (idx, field, value) => setBusinessInfo((p) => { const arr = [...p.businessLicenses]; arr[idx] = { ...arr[idx], [field]: value }; return { ...p, businessLicenses: arr }; });
	const removeBusinessLicense = (idx) => setBusinessInfo((p) => ({ ...p, businessLicenses: p.businessLicenses.filter((_, i) => i !== idx) }));

	// insurance helpers
	const updateInsurance = (field, value) => setInsurance((p) => ({ ...p, [field]: value }));

	// regulatory helpers
	const updateRegulatory = (field, value) => setRegulatory((p) => ({ ...p, [field]: value }));

	// maintenance helpers
	const addMaintenanceRecord = () => setMaintenance((p) => ({ ...p, maintenanceRecords: [...p.maintenanceRecords, { date: "", performedBy: "", notes: "", documentUrl: "" }] }));
	const updateMaintenanceRecord = (idx, field, value) => setMaintenance((p) => { const arr = [...p.maintenanceRecords]; arr[idx] = { ...arr[idx], [field]: value }; return { ...p, maintenanceRecords: arr }; });
	const removeMaintenanceRecord = (idx) => setMaintenance((p) => ({ ...p, maintenanceRecords: p.maintenanceRecords.filter((_, i) => i !== idx) }));

	// documents helpers (file inputs kept client-side)
	const handleFileChange = (groupKey, files) => {
		const list = Array.from(files).map((f) => ({ name: f.name, size: f.size, type: f.type, file: f }));
		setDocuments((p) => ({ ...p, [groupKey]: [...p[groupKey], ...list] }));
	};
	const removeDocument = (groupKey, index) => setDocuments((p) => { const arr = [...p[groupKey]]; arr.splice(index, 1); return { ...p, [groupKey]: arr }; });

	// attachments/promotional/press helpers
	const handleGenericFile = (setter, prevList, files) => {
		const list = Array.from(files).map((f) => ({ name: f.name, file: f }));
		setter([...prevList, ...list]);
	};
	const removeGenericFile = (setter, list, idx) => setter(list.filter((_, i) => i !== idx));

	// extras helpers
	const updateExtras = (field, value) => setExtras((p) => ({ ...p, [field]: value }));
	const updateSocialMedia = (field, value) => setExtras((p) => ({ ...p, socialMedia: { ...p.socialMedia, [field]: value } }));
	const addTestimonial = () => setExtras((p) => ({ ...p, testimonials: [...p.testimonials, { author: "", role: "", content: "", date: "" }] }));
	const updateTestimonial = (idx, field, value) => setExtras((p) => { const arr = [...p.testimonials]; arr[idx] = { ...arr[idx], [field]: value }; return { ...p, testimonials: arr }; });
	const removeTestimonial = (idx) => setExtras((p) => ({ ...p, testimonials: p.testimonials.filter((_, i) => i !== idx) }));

	const togglePaymentMethod = (method) => {
		setFinance((p) => {
			const exists = p.paymentMethodsAccepted.includes(method);
			return { ...p, paymentMethodsAccepted: exists ? p.paymentMethodsAccepted.filter((m) => m !== method) : [...p.paymentMethodsAccepted, method] };
		});
	};
	const updateFinance = (field, value) => setFinance((p) => ({ ...p, [field]: value }));

	// helper for logo file: set file in state and create preview URL
	const handleLogoFile = (file) => {
		// set file in company state
		setCompany((p) => ({ ...p, logo: file || null }));

		// revoke old preview URL if present
		setLogoPreview((prev) => {
			if (prev) URL.revokeObjectURL(prev);
			return null;
		});

		// create new preview URL when a file is selected
		if (file) {
			const url = URL.createObjectURL(file);
			setLogoPreview(url);
		}
	};

	// cleanup object URL on unmount
	useEffect(() => {
		return () => {
			if (logoPreview) URL.revokeObjectURL(logoPreview);
		};
	}, [logoPreview]);

	// certifications multi-select toggler
	const toggleCertification = (name) => {
		setCertificationsSelected((prev) => {
			if (prev.includes(name)) return prev.filter((p) => p !== name);
			return [...prev, name];
		});
	};

	// ---------------- Save ----------------
	const saveData = async (goNext = false) => {
		setSaving(true);
		try {
			const payload = {
				company: {
					...company,
					logo: company.logo ? { name: company.logo.name } : null,
				},
				location,
				contactInfo,
				businessInfo,
				insurance,
				regulatory: { ...regulatory, emergencyEquipment: regulatory.emergencyEquipment.split(",").map((s) => s.trim()).filter(Boolean) },
				maintenance,
				finance,
				documents: {
					businessLicenses: documents.businessLicenses.map((d) => ({ name: d.name })),
					taxCertificates: documents.taxCertificates.map((d) => ({ name: d.name })),
					insuranceCertificates: documents.insuranceCertificates.map((d) => ({ name: d.name })),
					identityProofs: documents.identityProofs.map((d) => ({ name: d.name })),
					addressProofs: documents.addressProofs.map((d) => ({ name: d.name })),
					religiousApprovals: documents.religiousApprovals.map((d) => ({ name: d.name })),
					nsopAopCertificates: documents.nsopAopCertificates.map((d) => ({ name: d.name })),
					dgcaComplianceDocs: documents.dgcaComplianceDocs.map((d) => ({ name: d.name })),
				},
				pressReleases: pressReleases.map((p) => ({ name: p.name })),
				extras,
			};

			await api.post("/operator", payload);
			toast.success("Saved successfully", { position: "top-right", autoClose: 2000 });
			if (goNext) setActiveTab((t) => Math.min(t + 1, TABS.length - 1));
		} catch (err) {
			const message = err?.response?.data?.message || "Save failed";
			toast.error(message, { position: "top-right", autoClose: 3500 });
		} finally {
			setSaving(false);
		}
	};

	// ---------------- UI per tab ----------------
	const card = (title, children) => (
		<div className="bg-white border rounded-lg p-4 shadow-sm">
			<h3 className="text-lg font-medium mb-3">{title}</h3>
			<div className="space-y-3">{children}</div>
		</div>
	);

	const COUNTRIES = [
		"India",
		"United States",
		"United Kingdom",
		"Australia",
		"Canada",
		"United Arab Emirates",
		"Germany",
		"France",
		"Spain",
		"Italy",
		"Netherlands",
		"Sweden",
		"Switzerland",
		"Singapore",
		"China",
		"Japan",
		"South Korea",
		"Brazil",
		"Mexico",
		"South Africa",
		"Nigeria",
		"Egypt",
		"Russia",
		"Turkey",
		"Indonesia",
		"Philippines",
		"Vietnam",
		"Thailand",
		"Malaysia",
		"Nepal",
		"Sri Lanka",
		"Bangladesh",
		"Pakistan",
		"Other"
	];

	const renderCompanyTab = () => (
		<div className="space-y-4">
			{card("Basic Info", (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Company Name</label>
							<input value={company.companyName} onChange={(e) => updateCompany("companyName", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Brand / Trade Name</label>
							<input value={company.brandName} onChange={(e) => updateCompany("brandName", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Logo</label>
						<div className="mt-1 flex items-center gap-4">
							{/* circular preview */}
							<div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
								{logoPreview ? (
									<img src={logoPreview} alt="logo preview" className="object-cover w-full h-full" />
								) : company.logo && typeof company.logo === "string" ? (
									/* if stored as URL string previously */
									<img src={company.logo} alt="logo" className="object-cover w-full h-full" />
								) : (
									<span className="text-xs text-gray-500">No image</span>
								)}
							</div>

							{/* file input */}
							<div>
								<input
									type="file"
									accept="image/*"
									onChange={(e) => handleLogoFile(e.target.files?.[0] || null)}
									className="rounded-md border px-3 py-2 bg-white cursor-pointer"
								/>
								{/* filename (small) */}
								{company.logo && company.logo.name && (
									<div className="text-sm text-gray-600 mt-1 truncate max-w-xs">{company.logo.name}</div>
								)}
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Company Description / Overview</label>
						<textarea value={company.description} onChange={(e) => updateCompany("description", e.target.value)} rows={4} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>

					<div className="flex items-center gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Year Established</label>
							<select value={company.yearEstablished} onChange={(e) => updateCompany("yearEstablished", e.target.value)} className="mt-1 block w-40 rounded-md border px-3 py-2">
								<option value="">Select year</option>
								{Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => 1950 + i).reverse().map((y) => (
									<option key={y} value={y}>{y}</option>
								))}
							</select>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700">Website</label>
							<input value={contactInfo.website} onChange={(e) => updateContact("website", e.target.value)} placeholder="https://..." className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
					</div>
				</>
			))}

			{card("Location", (
				<>
					<div>
						<label className="block text-sm font-medium text-gray-700">Headquarters Address</label>
						<textarea value={location.headquartersAddress} onChange={(e) => updateLocation("headquartersAddress", e.target.value)} rows={3} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label className="block text-sm font-medium text-gray-700">Branch Office Addresses</label>
							<button type="button" onClick={addBranch} className="text-sm text-blue-600 cursor-pointer">+ Add branch</button>
						</div>
						<div className="space-y-2 mt-2">
							{location.branches.map((b, idx) => (
								<div key={idx} className="p-3 border rounded-md bg-gray-50">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										<input placeholder="Branch label (optional)" value={b.label} onChange={(e) => updateBranch(idx, "label", e.target.value)} className="w-full px-2 py-1 rounded border" />
										<textarea placeholder="Branch address" value={b.address} onChange={(e) => updateBranch(idx, "address", e.target.value)} rows={2} className="w-full px-2 py-1 rounded border" />
									</div>
									<div className="text-right mt-2">
										<button type="button" onClick={() => removeBranch(idx)} className="text-red-600 text-sm cursor-pointer">Remove</button>
									</div>
								</div>
							))}
							{location.branches.length === 0 && <p className="text-sm text-gray-400">No branches added</p>}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<input placeholder="City" value={location.city} onChange={(e) => updateLocation("city", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="State" value={location.state} onChange={(e) => updateLocation("state", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<select value={location.country} onChange={(e) => updateLocation("country", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2">
							{COUNTRIES.map((c) => (
								<option key={c} value={c}>{c}</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input placeholder="Postal / Zip Code" value={location.postalCode} onChange={(e) => updateLocation("postalCode", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="Location link (map)" value={location.locationLink} onChange={(e) => updateLocation("locationLink", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
				</>
			))}

			{card("Primary Contact", (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">Primary Contact Person</label>
						<input value={contactInfo.primaryContactName} onChange={(e) => updateContact("primaryContactName", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Designation</label>
						<input value={contactInfo.designation} onChange={(e) => updateContact("designation", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Office Phone</label>
						<input value={contactInfo.officePhone} onChange={(e) => updateContact("officePhone", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Mobile Number</label>
						<input value={contactInfo.mobileNumber} onChange={(e) => updateContact("mobileNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Customer Support Contact</label>
						<input value={contactInfo.customerSupportContact} onChange={(e) => updateContact("customerSupportContact", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Email</label>
						<input type="email" value={contactInfo.email} onChange={(e) => updateContact("email", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
				</div>
			))}
		</div>
	);

	const renderLegalTab = () => (
		<div className="space-y-4">
			{card("Legal & Business Info", (
				<>
					{/* Registration & Tax */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Registration Number</label>
							<input value={businessInfo.registrationNumber} onChange={(e) => updateBusinessInfo("registrationNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Tax ID / VAT / GST Number</label>
							<input value={businessInfo.taxId} onChange={(e) => updateBusinessInfo("taxId", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
					</div>

					{/* Country of incorporation & business type */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
						<select value={businessInfo.countryOfIncorporation} onChange={(e) => updateBusinessInfo("countryOfIncorporation", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2">
							{COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
						</select>
						<select value={businessInfo.businessType} onChange={(e) => updateBusinessInfo("businessType", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2">
							<option>Private Limited</option>
							<option>Partnership</option>
							<option>Proprietorship</option>
							<option>Trust</option>
							<option>LLP</option>
							<option>Public Limited</option>
							<option>Other</option>
						</select>
					</div>

					{/* Business license file upload (legal) */}
					<div className="mt-3">
						<div className="flex items-center justify-between">
							<h4 className="text-sm font-medium text-gray-700">Business Licenses / Approvals</h4>
						</div>

						{/* File upload for business licenses (stores into documents.businessLicenses) */}
						<div className="mt-2 flex items-start gap-4">
							<div className="w-48">
								<label className="block text-sm font-medium text-gray-700">Upload License Files</label>
								<input type="file" multiple onChange={(e) => handleFileChange("businessLicenses", e.target.files)} className="mt-2 w-full rounded-md border px-3 py-2 bg-white cursor-pointer" />
							</div>
							<div className="flex-1 text-sm text-gray-600">
								{documents.businessLicenses.length > 0 ? (
									<ul className="list-disc ml-5">
										{documents.businessLicenses.map((f, i) => (
											<li key={i} className="flex items-center gap-3">
												<span className="truncate max-w-[60%]">{f.name}</span>
												<button type="button" onClick={() => removeDocument("businessLicenses", i)} className="text-red-500 text-xs cursor-pointer">Remove</button>
											</li>
										))}
									</ul>
								) : <span className="text-gray-400">No license files uploaded</span>}
							</div>
						</div>
					</div>
				</>
			))}

			{/* Insurance Provider & Policy + coverage types */}
			{card("Insurance", (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div>
						<label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
						<input placeholder="Provider" value={insurance.provider} onChange={(e) => updateInsurance("provider", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Primary Policy Number</label>
						<input placeholder="Policy Number" value={insurance.policyNumber} onChange={(e) => updateInsurance("policyNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>

					<div className="col-span-1 md:col-span-2 space-y-2 mt-2">
						<p className="text-sm text-gray-600">Insurance Coverage Types</p>
						<div className="flex flex-col gap-2 mt-1">
							<label className="flex items-center gap-2">
								<input type="checkbox" checked={insurance.hasAircraftInsurance} onChange={(e) => updateInsurance("hasAircraftInsurance", e.target.checked)} />
								<span className="text-sm">Aircraft Insurance</span>
							</label>
							{insurance.hasAircraftInsurance && (
								<input placeholder="Aircraft policy number" value={insurance.policyAircraftNumber} onChange={(e) => updateInsurance("policyAircraftNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
							)}

							<label className="flex items-center gap-2">
								<input type="checkbox" checked={insurance.hasThirdPartyInsurance} onChange={(e) => updateInsurance("hasThirdPartyInsurance", e.target.checked)} />
								<span className="text-sm">Third Party Insurance</span>
							</label>
							{insurance.hasThirdPartyInsurance && (
								<input placeholder="Third party policy number" value={insurance.policyThirdPartyNumber} onChange={(e) => updateInsurance("policyThirdPartyNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
							)}

							<label className="flex items-center gap-2">
								<input type="checkbox" checked={insurance.hasPatientLiabilityInsurance} onChange={(e) => updateInsurance("hasPatientLiabilityInsurance", e.target.checked)} />
								<span className="text-sm">Patient Liability Insurance</span>
							</label>
							{insurance.hasPatientLiabilityInsurance && (
								<input placeholder="Patient liability policy number" value={insurance.policyPatientLiabilityNumber} onChange={(e) => updateInsurance("policyPatientLiabilityNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
							)}
						</div>
					</div>
				</div>
			))}

			{/* Regulatory & safety */}
			{card("Regulatory & Safety", (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" checked={regulatory.dgcaAirAmbulanceApproval} onChange={(e) => updateRegulatory("dgcaAirAmbulanceApproval", e.target.checked)} />
							<span>DGCA Air Ambulance Approval</span>
						</label>

						<div>
							<label className="block text-sm font-medium text-gray-700">NSOP Number</label>
							<input placeholder="NSOP Number" value={regulatory.nsopNumber} onChange={(e) => updateRegulatory("nsopNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">Airworthiness Certificate Validity</label>
							<input type="date" value={regulatory.airworthinessCertificateValidity} onChange={(e) => updateRegulatory("airworthinessCertificateValidity", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Maintenance Organization Approval</label>
							<input placeholder="Maintenance Organization Approval (e.g. CAR 145)" value={regulatory.maintenanceOrganizationApproval} onChange={(e) => updateRegulatory("maintenanceOrganizationApproval", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
					</div>

					<div className="mt-3">
						<label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={regulatory.safetyManagementSystem} onChange={(e) => updateRegulatory("safetyManagementSystem", e.target.checked)} /> Safety Management System (Yes / No)</label>
					</div>

					<div className="mt-2">
						<label className="block text-sm font-medium text-gray-700">Emergency Evacuation Equipment (fire extinguishers, ELT, life vests, etc.)</label>
						<input placeholder="Comma separated list" value={regulatory.emergencyEquipment} onChange={(e) => updateRegulatory("emergencyEquipment", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
				</>
			))}
		</div>
	);

	const renderFinanceTab = () => (
		<div className="space-y-4">
			{card("Banking & Billing", (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input placeholder="Bank Name" value={finance.bankName} onChange={(e) => updateFinance("bankName", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="Branch Address" value={finance.branchAddress} onChange={(e) => updateFinance("branchAddress", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
						<input placeholder="Account Number / IBAN" value={finance.accountNumber} onChange={(e) => updateFinance("accountNumber", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="SWIFT / IFSC" value={finance.swiftIfsc} onChange={(e) => updateFinance("swiftIfsc", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
						<input placeholder="Account Holder Name" value={finance.accountHolderName} onChange={(e) => updateFinance("accountHolderName", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="Billing Address" value={finance.billingAddress} onChange={(e) => updateFinance("billingAddress", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>

					<div className="mt-3">
						<label className="block text-sm font-medium text-gray-700 mb-2">Payment Methods Accepted</label>
						<div className="flex gap-3 flex-wrap">
							{["bank_transfer", "card", "upi", "cash", "paypal"].map((m) => (
								<label key={m} className={`px-3 py-1 rounded border flex items-center gap-2 ${finance.paymentMethodsAccepted.includes(m) ? "bg-blue-50 border-blue-400" : "bg-white"}`}>
									<input type="checkbox" checked={finance.paymentMethodsAccepted.includes(m)} onChange={() => togglePaymentMethod(m)} />
									<span className="capitalize">{m.replace("_", " ")}</span>
								</label>
							))}
						</div>
					</div>
				</>
			))}
		</div>
	);

	const renderDocumentsTab = () => (
		<div className="space-y-4">
			{card("Upload Documents", (
				<>
					{[
						{ key: "businessLicenses", label: "Business Licenses" },
						{ key: "taxCertificates", label: "Tax Certificates" },
						{ key: "insuranceCertificates", label: "Insurance Certificates" },
						{ key: "identityProofs", label: "Identity Proofs" },
						{ key: "addressProofs", label: "Address Proofs" },
						{ key: "religiousApprovals", label: "Religious Approvals" },
						{ key: "nsopAopCertificates", label: "NSOP / AOP Certificates" },
						{ key: "dgcaComplianceDocs", label: "DGCA Compliance Docs" },
					].map((d) => (
						<div key={d.key} className="flex items-start gap-4">
							<div className="w-48">
								<label className="block text-sm font-medium text-gray-700">{d.label}</label>
								<input
									type="file"
									multiple
									onChange={(e) => handleFileChange(d.key, e.target.files)}
									className="mt-2 w-full rounded-md border px-3 py-2 bg-white cursor-pointer"
								/>
							</div>
							<div className="flex-1 text-sm text-gray-600">
								{documents[d.key].length > 0 ? (
									<ul className="list-disc ml-5">
										{documents[d.key].map((f, i) => (
											<li key={i} className="flex items-center gap-3">
												<span className="truncate max-w-[60%]">{f.name}</span>
												<button type="button" onClick={() => removeDocument(d.key, i)} className="text-red-500 text-xs cursor-pointer">Remove</button>
											</li>
										))}
									</ul>
								) : <span className="text-gray-400">No files selected</span>}
							</div>
						</div>
					))}
				</>
			))}
		</div>
	);

	const renderExtrasTab = () => (
		<div className="space-y-4">
			{card("Social & Marketing", (
				<>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<input placeholder="Facebook URL" value={extras.socialMedia.facebook} onChange={(e) => updateSocialMedia("facebook", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="Instagram URL" value={extras.socialMedia.instagram} onChange={(e) => updateSocialMedia("instagram", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="Twitter URL" value={extras.socialMedia.twitter} onChange={(e) => updateSocialMedia("twitter", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
						<input placeholder="LinkedIn URL" value={extras.socialMedia.linkedin} onChange={(e) => updateSocialMedia("linkedin", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
						<input placeholder="Youtube URL" value={extras.socialMedia.youtube} onChange={(e) => updateSocialMedia("youtube", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
				</>
			))}

			{card("Testimonials & Experience", (
				<>
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-600">Add past clients / testimonials</p>
						<button type="button" onClick={addTestimonial} className="text-sm text-blue-600 cursor-pointer">+ Add</button>
					</div>
					<div className="space-y-2 mt-2">
						{extras.testimonials.map((t, idx) => (
							<div key={idx} className="p-3 border rounded-md bg-gray-50">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
									<input placeholder="Author" value={t.author} onChange={(e) => updateTestimonial(idx, "author", e.target.value)} className="px-2 py-1 rounded border" />
									<input placeholder="Role" value={t.role} onChange={(e) => updateTestimonial(idx, "role", e.target.value)} className="px-2 py-1 rounded border" />
									<input type="date" value={t.date} onChange={(e) => updateTestimonial(idx, "date", e.target.value)} className="px-2 py-1 rounded border" />
								</div>
								<textarea placeholder="Content" value={t.content} onChange={(e) => updateTestimonial(idx, "content", e.target.value)} rows={2} className="mt-2 w-full px-2 py-1 rounded border" />
								<div className="text-right mt-2"><button onClick={() => removeTestimonial(idx)} className="text-red-600 text-sm cursor-pointer">Remove</button></div>
							</div>
						))}
						{extras.testimonials.length === 0 && <p className="text-sm text-gray-400">No testimonials</p>}
					</div>

					<div className="mt-3">
						<label className="block text-sm font-medium text-gray-700">Past Experience</label>
						<textarea value={extras.pastExperience} onChange={(e) => updateExtras("pastExperience", e.target.value)} rows={4} className="mt-1 block w-full rounded-md border px-3 py-2" />
					</div>
				</>
			))}

			{card("Press Releases", (
				<div>
					<label className="block text-sm font-medium text-gray-700">Press Releases</label>
					<input
						type="file"
						multiple
						onChange={(e) => handleGenericFile(setPressReleases, pressReleases, e.target.files)}
						className="mt-2 w-full rounded-md border px-3 py-2 bg-white cursor-pointer"
					/>
					{pressReleases.length > 0 && (
						<ul className="mt-2 text-sm text-gray-600">
							{pressReleases.map((p, i) => (
								<li key={i} className="flex items-center justify-between">
									<span className="truncate max-w-[80%]">{p.name}</span>
									<button onClick={() => removeGenericFile(setPressReleases, pressReleases, i)} className="text-red-500 text-xs cursor-pointer">Remove</button>
								</li>
							))}
						</ul>
					)}
				</div>
			))}

			{card("Preferences & Admin Notes", (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Preferred Communication Channel</label>
							<select value={extras.preferredCommunicationChannel} onChange={(e) => updateExtras("preferredCommunicationChannel", e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2">
								<option value="whatsapp">WhatsApp</option>
								<option value="email">Email</option>
								<option value="phone">Phone</option>
								<option value="other">Other</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">Notes For Admin</label>
							<textarea value={extras.notesForAdmin} onChange={(e) => updateExtras("notesForAdmin", e.target.value)} rows={3} className="mt-1 block w-full rounded-md border px-3 py-2" />
						</div>
					</div>
				</>
			))}
		</div>
	);

	// ---------------- Render ----------------
	return (
		<div className="p-6 max-w-6xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Company — CMS</h1>

			<div className="flex gap-3 mb-6 flex-wrap">
				{TABS.map((t, i) => (
					<button
						key={t}
						onClick={() => setActiveTab(i)}
						className={`px-4 py-2 rounded-full border cursor-pointer ${activeTab === i ? "bg-yellow-50 border-yellow-400 font-semibold" : "bg-white border-gray-200"}`}
					>
						{t}
					</button>
				))}
			</div>

			<div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
				<div className="min-h-[420px]">
					{activeTab === 0 && renderCompanyTab()}
					{activeTab === 1 && renderLegalTab()}
					{activeTab === 2 && renderFinanceTab()}
					{activeTab === 3 && renderDocumentsTab()}
					{activeTab === 4 && renderExtrasTab()}
				</div>

				<div className="mt-6 flex items-center justify-end gap-3">
					<button onClick={() => saveData(false)} disabled={saving} className="px-4 py-2 rounded-md bg-white border hover:bg-gray-100 cursor-pointer">
						{saving ? "Saving..." : "Save"}
					</button>
					<button onClick={() => saveData(true)} disabled={saving} className="px-4 py-2 rounded-md bg-[#ff6c2d] text-white hover:bg-[#ff5a0a] cursor-pointer">
						{saving ? "Saving..." : "Save and Next"}
					</button>
				</div>
			</div>

			<ToastContainer />
		</div>
	);
}