"use client";

import styles from "./AboutTeamGrid.module.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTeam } from "../../services/getTeam";
import { TeamMember } from "../../types";

export default function AboutTeamGrid() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();
  const locale = i18n.language;

  useEffect(() => {
    getTeam(locale).then((result) => {
      setTeam(result);
      setLoading(false);
    })
  }, [locale]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}></div>
          ))}
        </div>
      ) : team.length > 0 ? (
        team.map((member) => {
          const tr = member.translation[0];
          return (
            <div key={member.id} className={styles.card}>
              <img
                src={member.image_url}
                alt={tr.name}
                className={styles.photo}
              />

              <div className={styles.content}>
                <h3 className={styles.name}>{tr.name}</h3>
                <p className={styles.position}>{tr.position.join("\n")}</p>
                {tr.description.map((para, i) => (
                  <p key={`desc-${i}`} className={styles.description}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>Команду не знайдено.</p>
      )}
    </div>
  );
}
