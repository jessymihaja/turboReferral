## 🎯 Objectif du projet
RefPush est une application web centrée sur l'utilisateur, conçue pour partager des liens ou codes de parrainage de services, tout en garantissant transparence, sécurité et engagement communautaire.
La plateforme inclut :
Un système de validation des services par les administrateurs


Un moteur de recherche dynamique


Une modération intelligente


Une mise en avant des meilleures offres


Une association de chaque service à un thème (ex. Shopping, Mobilité, Jeux)



⚙️ 3. Fonctionnalités principales
👤 Tableau de bord utilisateur
Vue personnalisée de l’activité


Historique des liens postés


Accès aux votes, commentaires, réputation



🔗 Soumission de parrainage
Ajout d’un lien ou code pour un service approuvé


Types :


🟢 Permanent (sans limite de validité)


⏰ Promotionnel (limité dans le temps)


Description obligatoire : explique la récompense du filleul


 Ex. “Recevez 10€ de réduction sur votre première commande.”



Association du lien à un thème prédéfini :


Ex : 🛍️ Shopping / 🚗 Mobilité / 🎮 Jeux vidéo / 💳 Finance



🧭 Recherche dynamique
Barre de recherche type Google sur la page d’accueil


Affichage temps réel des services (avec icône de thème) lors de la recherche


Clic = page du service listant tous les liens associés



🆕 Demande d’ajout de service
Formulaire pour suggérer un nouveau service


Champ obligatoire : thème du service


Statut “En attente” jusqu’à validation admin



🧾 Gestion des liens
Visualiser, supprimer et gérer ses liens


Système communautaire :


👍 / 👎 votes


Mini-commentaires


Signalement rapide



👑 4. Fonctionnalités administrateur
✅ Validation des services
Liste des services en attente


Possibilité d’approuver, modifier, rejeter


⭐ Mise en avant (“Featured”)
Liens mis en avant dans les listes et carrousels


🛡️ Modération des signalements
Tableau des liens signalés


Actions :


Réactiver / Supprimer


Modifier la description


Avertir / suspendre l’auteur



🛡️ 5. Fiabilité et authenticité des liens
✅ Validation communautaire
Vote binaire “Fonctionne” / “Ne fonctionne pas”


Affichage :


% de votes positifs


Nombre de votes


Conséquences :


Masquage ou déclassement si mauvais score



🚩 Signalement
Motifs pré-définis :


Lien brisé


Trompeur


Abusif


Déclenchement automatique du statut “À vérifier”



🏅 Score de réputation
Calcul :


Ratio liens valides / invalides


Volume de votes


Ancienneté


Badges :


🟢 Fiable


🟡 Neutre


🔴 Risqué



🔐 6. Authentification et sécurité
Connexion / Inscription par email ou pseudo


Validation stricte des champs


JWT pour l’authentification


Passport.js pour les rôles (user, admin)



🧭 7. Navigation conditionnelle
Visiteurs :


Accueil, Connexion, Inscription


Utilisateurs connectés :


Accueil, Dashboard, Déconnexion



📄 8. Conditions Générales d’Utilisation
Acceptation obligatoire à l’inscription


Accessible en footer


Inclut :


Description du service


Règles de publication


Responsabilités utilisateurs


Politique de confidentialité


Modération et sanctions



🧱 9. Stack technique
Frontend
React + React Router


Axios


Backend
Node.js + Express


MongoDB + Mongoose


Sécurité
JWT


Passport.js



💡 10. Fonctionnalités supplémentaires recommandées
Voici des idées de fonctionnalités additionnelles pour enrichir RefPush :
✅ Favoris / Bookmark
Les utilisateurs peuvent sauvegarder des liens qu’ils souhaitent utiliser plus tard.


✅ Filtre par thème
Sur la page des services ou la recherche, possibilité de filtrer par thème (Shopping, Jeux, Finance, etc.).


✅ Expiration automatique des liens promotionnels
Les liens promotionnels peuvent être retirés automatiquement après leur date limite.


✅ Notifications
Les utilisateurs reçoivent des alertes :


Quand leur service est validé


Si un lien est signalé ou supprimé


Pour des offres mises en avant


✅ Système de badges / niveaux
Les parrains actifs reçoivent des badges (Top contributeur, Parrain d’or).


✅ Export de ses propres liens
Export CSV ou PDF de l’historique de ses liens soumis.


✅ Dark mode
Interface claire/sombre.



📈 11. Vision long terme
Déploiement mobile (PWA ou app native)


Internationalisation


Espace communautaire (forum, discussions)


Système premium pour booster la visibilité

