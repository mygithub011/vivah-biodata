"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BiodataFormData, BiodataState, CollectionId } from "@/types";

interface BiodataStore extends BiodataState {
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // Form actions
  setPersonalDetails: (data: Partial<BiodataFormData["personal"]>) => void;
  setEducationDetails: (data: Partial<BiodataFormData["education"]>) => void;
  setCareerDetails: (data: Partial<BiodataFormData["career"]>) => void;
  setFamilyDetails: (data: Partial<BiodataFormData["family"]>) => void;
  setContactDetails: (data: Partial<BiodataFormData["contact"]>) => void;
  setExpectations: (data: Partial<BiodataFormData["expectations"]>) => void;
  setAboutMe: (text: string) => void;
  setHobbies: (text: string) => void;
  setPhotoUrl: (url: string) => void;

  // Navigation
  setCollection: (id: CollectionId) => void;
  setTemplate: (id: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Preview / Payment
  setPreviewMode: (mode: boolean) => void;
  setPaymentStatus: (status: BiodataState["paymentStatus"]) => void;
  setDownloadToken: (token: string) => void;

  // Reset
  resetForm: () => void;
}

// Sample data used ONLY for template previews (carousel, collection pages)
export const sampleFormData: Partial<BiodataFormData> = {
  personal: {
    fullName: "Priya Sharma",
    dateOfBirth: "1997-03-15",
    timeOfBirth: "06:30 AM",
    placeOfBirth: "Jaipur, Rajasthan",
    height: "5'4\"",
    weight: "52 KG",
    complexion: "Fair",
    bloodGroup: "B+",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Brahmin",
    gotra: "Kashyap",
    nakshatra: "Rohini",
    rashi: "Vrishabh",
    manglik: "No",
    language: "Hindi, English",
    nationality: "Indian",
  },
  education: {
    highestQualification: "M.Tech (Computer Science)",
    fieldOfStudy: "Artificial Intelligence",
    institution: "IIT Delhi",
    yearOfPassing: "2021",
  },
  career: {
    employmentType: "Employed",
    currentDesignation: "Senior Software Engineer",
    company: "Google India",
    industry: "Technology",
    annualIncome: "32 LPA",
    workLocation: "Bengaluru",
  },
  family: {
    fatherName: "Mr. Rajesh Sharma",
    fatherOccupation: "Retired IAS Officer",
    motherName: "Mrs. Sunita Sharma",
    motherOccupation: "Homemaker",
    siblings: "1 Brother (Doctor, AIIMS)",
    familyType: "Nuclear",
    familyStatus: "Upper Middle Class",
    familyValues: "Moderate",
    nativePlace: "Jaipur, Rajasthan",
  },
  contact: {
    contactName: "Mr. Rajesh Sharma",
    phone: "+91 98765 43210",
    email: "sharma.family@email.com",
    city: "Bengaluru",
    state: "Karnataka",
  },
  expectations: {
    preferredAgeFrom: 28,
    preferredAgeTo: 33,
    preferredHeight: "5'8\" - 6'0\"",
    preferredEducation: "B.Tech/MBA or higher",
    preferredProfession: "Engineer/Doctor/IAS",
    otherExpectations: "Well-educated, family-oriented, and settled in a metro city.",
  },
  aboutMe:
    "A driven professional with a passion for technology and a deep respect for family values. I enjoy reading, traveling, and learning classical music in my free time.",
  hobbies: "Reading, Classical Dance, Travel, Photography",
  photoUrl: "/sample-photo.png",
};

// Empty form data — this is what users start with (blank fields)
// Uses type assertion for enum fields that will be validated on form submit
export const defaultFormData = {
  personal: {
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    height: "",
    weight: "",
    complexion: "",
    bloodGroup: "",
    maritalStatus: "Never Married",
    religion: "",
    caste: "",
    gotra: "",
    nakshatra: "",
    rashi: "",
    manglik: undefined,
    language: "",
    nationality: "",
  },
  education: {
    highestQualification: "",
    fieldOfStudy: "",
    institution: "",
    yearOfPassing: "",
  },
  career: {
    employmentType: "Employed",
    currentDesignation: "",
    company: "",
    industry: "",
    annualIncome: "",
    workLocation: "",
  },
  family: {
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    siblings: "",
    familyType: undefined,
    familyStatus: undefined,
    familyValues: undefined,
    nativePlace: "",
  },
  contact: {
    contactName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
  },
  expectations: {
    preferredAgeFrom: undefined as unknown as number,
    preferredAgeTo: undefined as unknown as number,
    preferredHeight: "",
    preferredEducation: "",
    preferredProfession: "",
    otherExpectations: "",
  },
  aboutMe: "",
  hobbies: "",
  photoUrl: "",
} as Partial<BiodataFormData>;

const initialState: BiodataState = {
  formData: defaultFormData,
  selectedCollectionId: null,
  selectedTemplateId: null,
  currentStep: 1,
  isPreviewMode: false,
  paymentStatus: "pending",
  downloadToken: null,
};

export const useBiodataStore = create<BiodataStore>()(
  persist(
    (set) => ({
      ...initialState,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setPersonalDetails: (data) =>
        set((s) => ({
          formData: { ...s.formData, personal: { ...s.formData.personal, ...data } as BiodataFormData["personal"] },
        })),

      setEducationDetails: (data) =>
        set((s) => ({
          formData: { ...s.formData, education: { ...s.formData.education, ...data } as BiodataFormData["education"] },
        })),

      setCareerDetails: (data) =>
        set((s) => ({
          formData: { ...s.formData, career: { ...s.formData.career, ...data } as BiodataFormData["career"] },
        })),

      setFamilyDetails: (data) =>
        set((s) => ({
          formData: { ...s.formData, family: { ...s.formData.family, ...data } as BiodataFormData["family"] },
        })),

      setContactDetails: (data) =>
        set((s) => ({
          formData: { ...s.formData, contact: { ...s.formData.contact, ...data } as BiodataFormData["contact"] },
        })),

      setExpectations: (data) =>
        set((s) => ({
          formData: { ...s.formData, expectations: { ...s.formData.expectations, ...data } as BiodataFormData["expectations"] },
        })),

      setAboutMe: (text) =>
        set((s) => ({ formData: { ...s.formData, aboutMe: text } })),

      setHobbies: (text) =>
        set((s) => ({ formData: { ...s.formData, hobbies: text } })),

      setPhotoUrl: (url) =>
        set((s) => ({ formData: { ...s.formData, photoUrl: url } })),

      setCollection: (id) => set({ selectedCollectionId: id }),
      setTemplate: (id) => set({ selectedTemplateId: id, currentStep: 1 }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      setPreviewMode: (mode) => set({ isPreviewMode: mode }),
      setPaymentStatus: (status) => set({ paymentStatus: status }),
      setDownloadToken: (token) => set({ downloadToken: token }),

      resetForm: () => set({ ...initialState }),
    }),
    {
      name: "shaadibio-store",
      partialize: (s) => ({
        selectedCollectionId: s.selectedCollectionId,
        selectedTemplateId: s.selectedTemplateId,
        currentStep: s.currentStep,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
