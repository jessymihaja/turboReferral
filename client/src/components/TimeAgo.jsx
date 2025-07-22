
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale'; // Pour avoir le résultat en français
import { FaClock } from 'react-icons/fa';

function TimeAgo({ isoDateString }) {
  // Convertir la chaîne ISO en objet Date
  const dateObj = parseISO(isoDateString);

  // Utiliser un état pour mettre à jour le temps passé (facultatif, mais utile pour des mises à jour régulières)
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // Fonction pour mettre à jour le temps passé
    const updateTimeAgo = () => {
      // Calculer le temps passé avec la locale française
      const result = formatDistanceToNow(dateObj, {
        addSuffix: true, // Ajoute "il y a" ou "dans"
        locale: fr,      // Utilise la locale française
      });
      setTimeAgo(result);
    };

    // Mettre à jour immédiatement
    updateTimeAgo();

    // Mettre à jour toutes les 60 secondes (pour "il y a X minutes/heures")
    // Adaptez cet intervalle à vos besoins
    const intervalId = setInterval(updateTimeAgo, 60 * 1000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [dateObj]); // Dépendance à dateObj pour recalculer si la date change

  return (
    <span style={{ alignItems: 'center', color: 'rgb(4 120 87 )',fontSize: '0.9rem', display: 'flex', gap: '0.2rem'}}>
      <FaClock/> {timeAgo}
    </span>
  );
}
export default TimeAgo;