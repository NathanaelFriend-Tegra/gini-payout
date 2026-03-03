import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createProfile } from "@/lib/api";
import { toast } from "sonner";

// ── Image compression helper ──────────────────────────────────────────────────
const compressImage = (
    base64: string,
    maxWidth: number,
    quality: number
): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxWidth / img.width);
            const canvas = document.createElement("canvas");
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressed = canvas.toDataURL("image/jpeg", quality);
            console.log(
                `🗜️ Compressed: ${Math.round(base64.length / 1024)}kb → ${Math.round(
                    compressed.length / 1024
                )}kb`
            );
            resolve(compressed);
        };
        img.src = base64;
    });
};

// ─────────────────────────────────────────────────────────────────────────────

const RegisterDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const mobileNumber = location.state?.mobileNumber || "";

    const selfieInputRef = useRef<HTMLInputElement>(null);
    const idPhotoInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
    const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        displayName: "",
        email: "",
        firstNames: "",
        surname: "",
        identityNumber: "",
        genderType: "MALE" as "MALE" | "FEMALE" | "OTHER",
        dateOfBirth: "",
        countryOfBirth: "ZA",
    });

    // Guard: redirect if no mobile number in state
    useEffect(() => {
        if (!mobileNumber) {
            toast.error("Please start from the beginning");
            navigate("/register");
        }
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "selfie" | "id"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (type === "selfie") setSelfiePreview(base64);
            else setIdPhotoPreview(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!selfiePreview || !idPhotoPreview) {
            toast.error("Please upload both your selfie and ID photo");
            return;
        }

        if (
            !form.displayName ||
            !form.email ||
            !form.firstNames ||
            !form.surname ||
            !form.identityNumber ||
            !form.dateOfBirth
        ) {
            toast.error("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            console.log("📝 Creating profile for:", mobileNumber);

            // Selfie: 600px wide, 50% quality → ~50–80kb
            // ID photo: 400px wide, 20% quality → ~30–60kb
            const [compressedSelfie, compressedId] = await Promise.all([
                compressImage(selfiePreview, 600, 0.5),
                compressImage(idPhotoPreview, 400, 0.2),
            ]);
            const formattedDOB = new Date(form.dateOfBirth).toISOString().split('T')[0];

            console.log("📸 Selfie size after compression (chars):", compressedSelfie.length);
            console.log("🪪 ID photo size after compression (chars):", compressedId.length);
            console.log('📤 Sending profile data:', JSON.stringify({
                displayName: form.displayName,
                email: form.email,
                mobileNumber,
                photoLength: compressedSelfie.length,
                identity: {
                    identityNumber: form.identityNumber,
                    firstNames: form.firstNames,
                    surname: form.surname,
                    genderType: form.genderType,
                    countryOfBirth: form.countryOfBirth,
                    dateOfBirth: formattedDOB,
                    photoLength: compressedId.length,
                }
            }, null, 2));

            const sanitize = (str: string) => str.trim().replace(/[\r\n]+/g, ' ');

            await createProfile({
                displayName: `${sanitize(form.firstNames)} ${sanitize(form.surname)}`,
                email: sanitize(form.email),
                mobileNumber,
                photo: compressedSelfie,
                identity: {
                    identityNumber: sanitize(form.identityNumber),
                    firstNames: sanitize(form.firstNames),
                    surname: sanitize(form.surname),
                    genderType: form.genderType,
                    countryOfBirth: sanitize(form.countryOfBirth),
                    dateOfBirth: formattedDOB,
                    photo: compressedId,
                },
            });
            console.log("✅ Profile created");
            toast.success("Profile created! Let's verify your number.");
            navigate("/register/pin", { state: { mobileNumber } });
        } catch (error: any) {
            console.error("❌ Profile creation failed:", error);
            toast.error(error.message || "Could not create profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="px-6 pt-12 pb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-muted-foreground text-sm mb-8 flex items-center gap-2"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-foreground">Your details</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Fill in your personal information to create your profile.
                </p>
            </div>

            <div className="px-6 flex-1 flex flex-col gap-4 pb-10">
                {/* Personal Info */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                        Personal
                    </h2>

                    {[
                        { name: "displayName", label: "Display name", placeholder: "e.g. Nathanael Friend", type: "text" },
                        { name: "email", label: "Email address", placeholder: "e.g. nate@example.com", type: "email" },
                        { name: "firstNames", label: "First names", placeholder: "e.g. Nathanael", type: "text" },
                        { name: "surname", label: "Surname", placeholder: "e.g. Friend", type: "text" },
                        { name: "identityNumber", label: "ID number", placeholder: "e.g. 0311025023087", type: "text" },
                        { name: "dateOfBirth", label: "Date of birth", placeholder: "YYYY-MM-DD", type: "date" },
                        { name: "countryOfBirth", label: "Country of birth (ISO)", placeholder: "e.g. ZA", type: "text" },
                    ].map(({ name, label, placeholder, type }) => (
                        <div key={name} className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">{label}</label>
                            <input
                                name={name}
                                type={type}
                                value={(form as any)[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    ))}

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">
                            Gender
                        </label>
                        <select
                            name="genderType"
                            value={form.genderType}
                            onChange={handleChange}
                            className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>

                {/* Photos */}
                <div className="space-y-3 mt-2">
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                        Photos
                    </h2>

                    {/* Selfie */}
                    <div
                        onClick={() => selfieInputRef.current?.click()}
                        className="border-2 border-dashed border-input rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition-colors"
                    >
                        {selfiePreview ? (
                            <>
                                <img
                                    src={selfiePreview}
                                    alt="Selfie"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <p className="text-xs text-muted-foreground">Tap to change</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                                    📸
                                </div>
                                <p className="text-sm font-medium text-foreground">Upload selfie</p>
                                <p className="text-xs text-muted-foreground">Clear face photo</p>
                            </>
                        )}
                        <input
                            ref={selfieInputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "selfie")}
                        />
                    </div>

                    {/* ID Photo */}
                    <div
                        onClick={() => idPhotoInputRef.current?.click()}
                        className="border-2 border-dashed border-input rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition-colors"
                    >
                        {idPhotoPreview ? (
                            <>
                                <img
                                    src={idPhotoPreview}
                                    alt="ID"
                                    className="w-32 h-20 rounded-lg object-cover"
                                />
                                <p className="text-xs text-muted-foreground">Tap to change</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                                    🪪
                                </div>
                                <p className="text-sm font-medium text-foreground">Upload ID card</p>
                                <p className="text-xs text-muted-foreground">
                                    South African ID document
                                </p>
                            </>
                        )}
                        <input
                            ref={idPhotoInputRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, "id")}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-base disabled:opacity-60 mt-4"
                >
                    {loading ? "Creating profile..." : "Continue"}
                </button>
            </div>
        </div>
    );
};

export default RegisterDetailsPage;