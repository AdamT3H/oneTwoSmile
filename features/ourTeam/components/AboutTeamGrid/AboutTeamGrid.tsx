"use client";

import styles from "./AboutTeamGrid.module.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTeam } from "../../services/getTeam";
import { TeamMember } from "../../types";
import Link from "next/link";
import Image from "next/image";
import EasyWeekIntegration from "@/components/EasyWeekIntegration";

export default function AboutTeamGrid() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  useEffect(() => {
    getTeam(locale).then((result) => {
      setTeam(result);
      setLoading(false);
    })
  }, [locale]);

  return (
    <div className={styles.container}>
      <EasyWeekIntegration employees={team} />
      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : team.length > 0 ? (
        <div className={styles.grid}>
          {team.map((member) => (
            <div key={member.id} className={styles.cardWrapper}>
              <div className={styles.photoWrapper}>
                <Image
                  src={member.image_url}
                  alt={member.translation.name}
                  fill
                  className={styles.photo}
                />
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <div>
                    <h3 className={styles.name}>{member.translation.name}</h3>
                    {member.translation.specialty && (
                      <p className={styles.specialty}>{member.translation.specialty}</p>
                    )}
                  </div>

                  {member.experience_years !== null && (
                    <span className={styles.experience}>
                      {t("experience")} {member.experience_years} {t("years")}
                    </span>
                  )}
                </div>

                {member.translation.education && (
                  <div>
                    <p className={styles.label}>{t("education")}</p>
                    <p className={styles.value}>{member.translation.education}</p>
                  </div>
                )}

                {member.treatmentDirections.length > 0 && (
                  <div>
                    <p className={styles.label}>{t("treatmentDirections")}</p>
                    <ul className={styles.directionsList}>
                      {member.treatmentDirections.map((dir) => (
                        <li key={dir.id}>
                          <Link href={`/service?category=${dir.categoryId}`} className={styles.directionTag}>
                            {dir.categoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.footer}>
                  <button
                    type="button"
                    className={`${styles.bookButton} doctor-book-${member.id}`}
                  >
                    {t("bookAppointment")}
                  </button>
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
