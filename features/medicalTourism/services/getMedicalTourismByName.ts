import { supabase } from "@/lib/supabase";
import { MedicalTourism, MedicalTourismRaw, TourismOption } from "../types";

export async function getMedicalTourismByName(
    name: string,
    currentLang: string
): Promise<MedicalTourism | null> {
    const { data, error } = await supabase
        .from("medical_turism")
        .select(
        `
        *,
        medical_tourism_translations:medical_tourism_translations_tourism_id_fkey (
            description,
            language_code
        ),
        medical_tourism_options:medical_tourism_options_medical_id_fkey (
            id,
            medical_tourism_option_translations:medical_tourism_option_translations_option_id_fkey (
                title,
                details,
                language_code
            )
        )
        `
        )
        .eq("name", name)
        .single<MedicalTourismRaw>();

    if (error || !data) {
        console.error(error);
        return null;
    }

    const translation = data.medical_tourism_translations?.find(
        (t) => t.language_code === currentLang
    );

    const options: TourismOption[] = data.medical_tourism_options?.map((opt) => {
        const translationOpt =
        opt.medical_tourism_option_translations?.find(
            (t) => t.language_code === currentLang
        ) ??
        opt.medical_tourism_option_translations?.find(
            (t) => t.language_code === "en"
        );

        return {
        id: opt.id,
        title: translationOpt?.title ?? "No title",
        details: translationOpt?.details ?? "",
        };
    }) ?? [];

    return({
        id: data.id,
        name: data.name,
        description: translation?.description,
        duration: data.duration,
        photo: data.photo,
        price: data.price,
        options,
    });
}