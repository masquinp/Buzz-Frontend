// sert à formater les dates dans l'application, notamment pour les afficher de manière lisible à l'utilisateur
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("fr-FR") +
    " à " +
    date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  );
};