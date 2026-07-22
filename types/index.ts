// ─── Biodata Data Model ─────────────────────────────────────────────────────

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  age?: number;
  height: string;
  weight?: string;
  complexion?: string;
  bloodGroup?: string;
  maritalStatus: "Never Married" | "Divorced" | "Widowed";
  religion: string;
  caste: string;
  subCaste?: string;
  gotra?: string;
  nakshatra?: string;
  rashi?: string;
  manglik?: "Yes" | "No" | "Partial";
  language?: string;
  nationality?: string;
}

export interface EducationDetails {
  highestQualification: string;
  fieldOfStudy?: string;
  institution?: string;
  yearOfPassing?: string;
  additionalQualifications?: string;
}

export interface CareerDetails {
  employmentType: "Employed" | "Self-Employed" | "Business" | "Student" | "Other";
  currentDesignation?: string;
  company?: string;
  industry?: string;
  annualIncome?: string;
  workLocation?: string;
}

export interface FamilyDetails {
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  siblings?: string;
  familyType?: "Nuclear" | "Joint";
  familyStatus?: "Middle Class" | "Upper Middle Class" | "Affluent";
  familyValues?: "Traditional" | "Moderate" | "Liberal";
  nativePlace?: string;
  ancestralOrigin?: string;
}

export interface ContactDetails {
  contactName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
}

export interface PartnerExpectations {
  preferredAgeFrom?: number;
  preferredAgeTo?: number;
  preferredHeight?: string;
  preferredCaste?: string;
  preferredEducation?: string;
  preferredProfession?: string;
  preferredLocation?: string;
  otherExpectations?: string;
}

export interface BiodataFormData {
  personal: PersonalDetails;
  education: EducationDetails;
  career: CareerDetails;
  family: FamilyDetails;
  contact: ContactDetails;
  expectations: PartnerExpectations;
  aboutMe?: string;
  hobbies?: string;
  photoUrl?: string;
}

// ─── Template System ─────────────────────────────────────────────────────────

export type CollectionId =
  | "royal"
  | "floral"
  | "traditional"
  | "modern"
  | "luxury"
  | "heritage"
  | "elegant"
  | "regional";

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  lightBg: string;
}

export interface TemplateFonts {
  heading: string;
  body: string;
  decorative?: string;
}

export type LayoutSection =
  | "header"
  | "photo"
  | "personal"
  | "about"
  | "family"
  | "education"
  | "career"
  | "expectations"
  | "contact";

export interface BiodataTemplate {
  id: string;
  name: string;
  collectionId: CollectionId;
  tagline: string;
  colors: TemplateColors;
  fonts: TemplateFonts;
  headerStyle: "centered-ornate" | "left-aligned" | "split" | "banner";
  photoShape: "circle" | "oval" | "rounded-square" | "square";
  photoPosition: "top-center" | "top-right" | "top-left" | "sidebar";
  sectionStyle: "card" | "line-separated" | "bordered" | "minimal";
  decorativeElements: string[];
  layout: LayoutSection[];
  orientation: "portrait" | "landscape";
  previewColor: string; // CSS gradient for preview card
}

export interface Collection {
  id: CollectionId;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  badge: string;
  previewGradient: string;
  templates: BiodataTemplate[];
}

// ─── Payment & Orders ────────────────────────────────────────────────────────

export type PricingTier = "free" | "premium" | "premium_plus";

export interface PricingPlan {
  id: PricingTier;
  name: string;
  price: number;
  features: string[];
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface BiodataState {
  formData: Partial<BiodataFormData>;
  selectedCollectionId: CollectionId | null;
  selectedTemplateId: string | null;
  currentStep: number;
  isPreviewMode: boolean;
  paymentStatus: "pending" | "paid" | "failed";
  downloadToken: string | null;
}
