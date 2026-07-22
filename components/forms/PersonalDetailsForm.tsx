"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  height: z.string().min(1, "Height is required"),
  weight: z.string().optional(),
  complexion: z.string().optional(),
  bloodGroup: z.string().optional(),
  maritalStatus: z.enum(["Never Married", "Divorced", "Widowed"]),
  religion: z.string().min(1, "Religion is required"),
  caste: z.string().min(1, "Caste is required"),
  subCaste: z.string().optional(),
  gotra: z.string().optional(),
  nakshatra: z.string().optional(),
  rashi: z.string().optional(),
  manglik: z.union([z.enum(["Yes", "No", "Partial"]), z.literal("")]).optional(),
  language: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function PersonalDetailsForm() {
  const { formData, setPersonalDetails, nextStep } = useBiodataStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: formData.personal as FormValues,
  });

  const onSubmit = (data: FormValues) => {
    setPersonalDetails(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          placeholder="e.g. Priya Sharma"
          required
          {...register("fullName")}
          error={errors.fullName?.message}
        />
        <Input
          label="Date of Birth"
          type="date"
          required
          {...register("dateOfBirth")}
          error={errors.dateOfBirth?.message}
        />
        <Input
          label="Time of Birth"
          placeholder="e.g. 10:30 AM"
          {...register("timeOfBirth")}
        />
        <Input
          label="Place of Birth"
          placeholder="e.g. Varanasi, UP"
          {...register("placeOfBirth")}
        />
        <Input
          label="Height"
          placeholder={`e.g. 5'6" or 168 cm`}
          required
          {...register("height")}
          error={errors.height?.message}
        />
        <Input
          label="Weight"
          placeholder="e.g. 55 kg"
          {...register("weight")}
        />
        <Select
          label="Complexion"
          {...register("complexion")}
          options={[
            { value: "Fair", label: "Fair" },
            { value: "Wheatish", label: "Wheatish" },
            { value: "Wheatish Medium", label: "Wheatish Medium" },
            { value: "Dark", label: "Dark" },
          ]}
        />
        <Select
          label="Blood Group"
          {...register("bloodGroup")}
          options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => ({ value: bg, label: bg }))}
        />
        <Select
          label="Marital Status"
          required
          {...register("maritalStatus")}
          error={errors.maritalStatus?.message}
          options={[
            { value: "Never Married", label: "Never Married" },
            { value: "Divorced", label: "Divorced" },
            { value: "Widowed", label: "Widowed" },
          ]}
        />
        <Input
          label="Religion"
          placeholder="e.g. Hindu"
          required
          {...register("religion")}
          error={errors.religion?.message}
        />
        <Input
          label="Caste"
          placeholder="e.g. Brahmin, Kshatriya"
          required
          {...register("caste")}
          error={errors.caste?.message}
        />
        <Input
          label="Sub-Caste"
          placeholder="e.g. Saraswat"
          {...register("subCaste")}
        />
        <Input
          label="Gotra"
          placeholder="e.g. Kashyap"
          {...register("gotra")}
        />
        <Input
          label="Nakshatra"
          placeholder="e.g. Rohini"
          {...register("nakshatra")}
        />
        <Input
          label="Rashi (Moon Sign)"
          placeholder="e.g. Vrishabha"
          {...register("rashi")}
        />
        <Select
          label="Manglik"
          {...register("manglik")}
          options={[
            { value: "No", label: "No" },
            { value: "Yes", label: "Yes" },
            { value: "Partial", label: "Partial / Anshik" },
          ]}
        />
        <Input
          label="Mother Tongue"
          placeholder="e.g. Hindi, Marathi"
          {...register("language")}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" size="lg">
          Next: Family Details →
        </Button>
      </div>
    </form>
  );
}
