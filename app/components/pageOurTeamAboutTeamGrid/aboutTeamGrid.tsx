"use client"

import styles from './aboutTeamGrid.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";

type TeamMember = {
  id: number;
  name: string;
  image_url: string;
  position: string;
};

export default function AboutTeamGrid() {
  const [flipped, setFlipped] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  useEffect(() => {
    const fetchTeam = async () => {

      const { data, error } = await supabase.from("team-members-info").select("*");
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
            <div key={member.id} className={styles.flipCard} onClick={handleFlip}>
              <div className={styles.flipCardInner}>
                <div className={styles.flipCardFront}>
                  <Image
                    src={member.image_url}
                    alt="Team member"
                    width={200}
                    height={250}
                    className={styles.image}
                  />
                  <h3 className={styles.name}>{member.name}</h3>
                </div>
                <div className={styles.flipCardBack}>
                  <h3 className={styles.name}>{member.name}</h3>
                  <p className={styles.role}>{member.position}</p>
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