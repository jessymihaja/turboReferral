
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale'; // Pour avoir le résultat en français

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
    <p>
      Publié : **{timeAgo}**
    </p>
  );
}
export default TimeAgo;