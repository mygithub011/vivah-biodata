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

const defaultFormData: Partial<BiodataFormData> = {
  personal: {
    fullName: "",
    dateOfBirth: "",
    height: "",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "",
  },
  education: { highestQualification: "" },
  career: { employmentType: "Employed" },
  family: {},
  contact: { contactName: "", phone: "", city: "", state: "" },
  expectations: {},
  aboutMe: "",
  hobbies: "",
};

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
      setTemplate: (id) => set({ selectedTemplateId: id }),
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
        formData: s.formData,
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
