"use client";

import styles from "./aboutTeamGrid.module.css";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

type TeamTranslation = {
  name: string;
  position: string[];
  description: string[];
};

type TeamMember = {
  id: number;
  image_url: string;
  translation: TeamTranslation;
};
export default function AboutTeamGrid() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const lang = pathname.includes("/pl")
    ? "pl"
    : pathname.includes("/en")
    ? "en"
    : "ua";

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from("team_member")
        .select(
          `
        id,
        image_url,
        translation:team_member_translation (
          name,
          position,
          description
        )
      `
        )
        .eq("translation.language_code", lang);
      if (error) {
        console.error("Помилка при завантаженні команди:", error);
      } else {
        setTeam(
          data.map((member: any) => ({
            id: member.id,
            image_url: member.image_url,
            translation: member.translation[0],
          }))
        );
      }
      setLoading(false);
    };

    fetchTeam();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : team.length > 0 ? (
        team.map((member) => (
          <div key={member.id} className={styles.card}>
            <img
              src={member.image_url}
              alt={member.translation.name}
              className={styles.photo}
            />

            <div className={styles.content}>
              <h3 className={styles.name}>{member.translation.name}</h3>

              <p className={styles.position}>
                {member.translation.position.join("\n")}
              </p>

              {member.translation.description.map((para, i) => (
                <p key={`desc-${i}`} className={styles.description}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Команду не знайдено.</p>
      )}
    </div>
  );
}
