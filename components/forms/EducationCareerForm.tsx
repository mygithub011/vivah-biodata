"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBiodataStore } from "@/lib/store/biodataStore";
import { Input, Select, Textarea } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  // Education
  highestQualification: z.string().min(1, "Qualification is required"),
  fieldOfStudy: z.string().optional(),
  institution: z.string().optional(),
  yearOfPassing: z.string().optional(),
  additionalQualifications: z.string().optional(),
  // Career
  employmentType: z.enum(["Employed", "Self-Employed", "Business", "Student", "Other"]),
  currentDesignation: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  annualIncome: z.string().optional(),
  workLocation: z.string().optional(),
  // Contact
  contactName: z.string().min(1, "Contact name is required"),
  phone: z.string().min(10, "Valid phone required"),
  alternatePhone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().optional(),
  // Expectations
  preferredAgeFrom: z.coerce.number().optional(),
  preferredAgeTo: z.coerce.number().optional(),
  preferredHeight: z.string().optional(),
  preferredCaste: z.string().optional(),
  preferredEducation: z.string().optional(),
  preferredProfession: z.string().optional(),
  preferredLocation: z.string().optional(),
  otherExpectations: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function EducationCareerForm() {
  const { formData, setEducationDetails, setCareerDetails, setContactDetails, setExpectations, nextStep, prevStep } =
    useBiodataStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      ...formData.education,
      ...formData.career,
      ...formData.contact,
      ...formData.expectations,
    } as FormValues,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: FormValues) => {
    setEducationDetails({
      highestQualification: data.highestQualification,
      fieldOfStudy: data.fieldOfStudy,
      institution: data.institution,
      yearOfPassing: data.yearOfPassing,
      additionalQualifications: data.additionalQualifications,
    });
    setCareerDetails({
      employmentType: data.employmentType,
      currentDesignation: data.currentDesignation,
      company: data.company,
      industry: data.industry,
      annualIncome: data.annualIncome,
      workLocation: data.workLocation,
    });
    setContactDetails({
      contactName: data.contactName,
      phone: data.phone,
      alternatePhone: data.alternatePhone,
      email: data.email,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
    });
    setExpectations({
      preferredAgeFrom: data.preferredAgeFrom,
      preferredAgeTo: data.preferredAgeTo,
      preferredHeight: data.preferredHeight,
      preferredCaste: data.preferredCaste,
      preferredEducation: data.preferredEducation,
      preferredProfession: data.preferredProfession,
      preferredLocation: data.preferredLocation,
      otherExpectations: data.otherExpectations,
    });
    nextStep();
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
      {/* Education */}
      <section>
        <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-amber-100 pb-2">🎓 Education</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Highest Qualification"
            placeholder="e.g. B.Tech, M.B.A, M.B.B.S"
            required
            {...register("highestQualification")}
            error={errors.highestQualification?.message}
          />
          <Input label="Field of Study" placeholder="e.g. Computer Science" {...register("fieldOfStudy")} />
          <Input label="College / University" placeholder="e.g. IIT Delhi" {...register("institution")} />
          <Input label="Year of Passing" placeholder="e.g. 2020" {...register("yearOfPassing")} />
          <Input
            label="Additional Qualifications"
            placeholder="e.g. CFA, CA, PhD pursuing"
            {...register("additionalQualifications")}
          />
        </div>
      </section>

      {/* Career */}
      <section>
        <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-amber-100 pb-2">💼 Career</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <Select
            label="Employment Type"
            required
            {...register("employmentType")}
            error={errors.employmentType?.message}
            options={[
              { value: "Employed", label: "Employed (Job)" },
              { value: "Self-Employed", label: "Self-Employed / Freelancer" },
              { value: "Business", label: "Own Business" },
              { value: "Student", label: "Student" },
              { value: "Other", label: "Other" },
            ]}
          />
          <Input label="Current Designation" placeholder="e.g. Software Engineer" {...register("currentDesignation")} />
          <Input label="Company / Organisation" placeholder="e.g. TCS, Google" {...register("company")} />
          <Input label="Industry" placeholder="e.g. IT, Banking, Healthcare" {...register("industry")} />
          <Input label="Annual Income" placeholder="e.g. ₹12 LPA, ₹50,000/month" {...register("annualIncome")} />
          <Input label="Work Location" placeholder="e.g. Bangalore, Mumbai" {...register("workLocation")} />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-amber-100 pb-2">📞 Contact Details</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Contact Person Name"
            placeholder="e.g. Rajesh Sharma (Father)"
            required
            {...register("contactName")}
            error={errors.contactName?.message}
          />
          <Input
            label="Phone Number"
            placeholder="e.g. +91 98765 43210"
            required
            {...register("phone")}
            error={errors.phone?.message}
          />
          <Input label="Alternate Phone" placeholder="Optional" {...register("alternatePhone")} />
          <Input label="Email" placeholder="e.g. family@email.com" {...register("email")} error={errors.email?.message} />
          <Input label="City" placeholder="e.g. Delhi" required {...register("city")} error={errors.city?.message} />
          <Input label="State" placeholder="e.g. Uttar Pradesh" required {...register("state")} error={errors.state?.message} />
          <div className="md:col-span-2">
            <Input label="Full Address" placeholder="House/Flat No, Street, Area (optional)" {...register("address")} />
          </div>
          <Input label="Pincode" placeholder="e.g. 110001" {...register("pincode")} />
        </div>
      </section>

      {/* Partner Expectations */}
      <section>
        <h3 className="font-bold text-gray-900 mb-4 text-base border-b border-amber-100 pb-2">💑 Partner Expectations</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Preferred Age (From)"
            type="number"
            placeholder="e.g. 24"
            {...register("preferredAgeFrom")}
          />
          <Input
            label="Preferred Age (To)"
            type="number"
            placeholder="e.g. 30"
            {...register("preferredAgeTo")}
          />
          <Input
            label="Preferred Height"
            placeholder={`e.g. 5'4" and above`}
            {...register("preferredHeight")}
          />
          <Input label="Preferred Caste" placeholder="e.g. Any Brahmin or leave blank" {...register("preferredCaste")} />
          <Input
            label="Preferred Education"
            placeholder="e.g. Graduate and above"
            {...register("preferredEducation")}
          />
          <Input
            label="Preferred Profession"
            placeholder="e.g. Any professional"
            {...register("preferredProfession")}
          />
          <Input
            label="Preferred Location"
            placeholder="e.g. Delhi NCR preferred"
            {...register("preferredLocation")}
          />
          <div className="md:col-span-2">
            <Textarea
              label="Other Expectations"
              placeholder="Any other preferences or requirements..."
              {...register("otherExpectations")}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" size="lg" onClick={prevStep}>
          ← Back
        </Button>
        <Button type="submit" variant="primary" size="lg">
          Next: Photo & About Me →
        </Button>
      </div>
    </form>
  );
}
