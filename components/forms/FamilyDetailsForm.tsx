"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { Input, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  siblings: z.string().optional(),
  familyType: z.enum(["Nuclear", "Joint"]).optional(),
  familyStatus: z.enum(["Middle Class", "Upper Middle Class", "Affluent"]).optional(),
  familyValues: z.enum(["Traditional", "Moderate", "Liberal"]).optional(),
  nativePlace: z.string().optional(),
  ancestralOrigin: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function FamilyDetailsForm() {
  const { formData, setFamilyDetails, nextStep, prevStep } = useBiodataStore();

  const {
    register,
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: formData.family as FormValues,
  });

  const onSubmit = (data: FormValues) => {
    setFamilyDetails(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Father's Name" placeholder="e.g. Rajesh Sharma" {...register("fatherName")} />
        <Input label="Father's Occupation" placeholder="e.g. Business, Retired" {...register("fatherOccupation")} />
        <Input label="Mother's Name" placeholder="e.g. Sunita Sharma" {...register("motherName")} />
        <Input label="Mother's Occupation" placeholder="e.g. Homemaker, Teacher" {...register("motherOccupation")} />
        <Input
          label="Siblings"
          placeholder="e.g. 1 Elder Brother (Married), 1 Younger Sister"
          {...register("siblings")}
        />
        <Input label="Native Place" placeholder="e.g. Varanasi, Uttar Pradesh" {...register("nativePlace")} />
        <Input
          label="Ancestral Origin"
          placeholder="e.g. Originally from Rajasthan"
          {...register("ancestralOrigin")}
        />
        <Select
          label="Family Type"
          {...register("familyType")}
          options={[
            { value: "Nuclear", label: "Nuclear Family" },
            { value: "Joint", label: "Joint Family" },
          ]}
        />
        <Select
          label="Family Status"
          {...register("familyStatus")}
          options={[
            { value: "Middle Class", label: "Middle Class" },
            { value: "Upper Middle Class", label: "Upper Middle Class" },
            { value: "Affluent", label: "Affluent / Well-to-do" },
          ]}
        />
        <Select
          label="Family Values"
          {...register("familyValues")}
          options={[
            { value: "Traditional", label: "Traditional" },
            { value: "Moderate", label: "Moderate" },
            { value: "Liberal", label: "Liberal" },
          ]}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onClick={prevStep}>
          ← Back
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Next: Education & Career →
        </Button>
      </div>
    </form>
  );
}
