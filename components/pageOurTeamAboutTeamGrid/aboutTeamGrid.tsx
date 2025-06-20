"use client";

import styles from "./aboutTeamGrid.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

type TeamMember = {
  id: number;
  name: string;
  image_url: string;
  position: string;
  position_ENG: string;
  position_PL: string;
  nameENG_PL?: string;
  experience: number;
};

export default function AboutTeamGrid() {
  const [flipped, setFlipped] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const lang = pathname.includes("/pl")
    ? "pl"
    : pathname.includes("/en")
    ? "en"
    : "ua";

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  function getExperienceLabel(years: number, lang: string): string {
    if (lang === "ua") {
      if (years === 1) return " рік досвіду";
      if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100))
        return " роки досвіду";
      return " років досвіду";
    }

    if (lang === "pl") {
      return years === 1 ? " rok doświadczenia" : " lat doświadczenia";
    }

    // English
    return years === 1 ? " year of experience" : " years of experience";
  }

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from("team-members-info")
        .select("*");
      if (error) {
        console.error("Помилка при завантаженні команди:", error);
      } else {
        setTeam(data);
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
        <div className={styles.grid}>
          {team.map((member) => (
            <div
              key={member.id}
              className={styles.flipCard}
              onClick={handleFlip}
            >
              <div className={styles.flipCardInner}>
                <div className={styles.flipCardFront}>
                  <Image
                    src={member.image_url}
                    alt="Team member"
                    width={200}
                    height={250}
                    className={styles.image}
                  />
                  <h3 className={styles.name}>
                    {lang === "pl"
                      ? member.nameENG_PL
                      : lang === "en"
                      ? member.nameENG_PL
                      : member.name}
                  </h3>
                </div>
                <div className={styles.flipCardBack}>
                  <h3 className={styles.name}>
                    {lang === "pl"
                      ? member.nameENG_PL
                      : lang === "en"
                      ? member.nameENG_PL
                      : member.name}
                  </h3>
                  <p className={styles.role}>
                    {lang === "pl"
                      ? member.position_PL
                      : lang === "en"
                      ? member.position_ENG
                      : member.position}
                  </p>
                  <p className={styles.experience}>
                    {member.experience}
                    {getExperienceLabel(member.experience, lang)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Команду не знайдено.</p>
      )}
    </div>
  );
}
