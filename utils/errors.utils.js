// Fonction pour formater les erreurs lors de l'inscription
module.exports.signUpErrors = (err) => {
  let errors = { email: "", password: "" }; // Objet pour stocker les messages d'erreur

  if (err.message.includes("email")) errors.email = "Email incorrect"; // Erreur si l'email est invalide

  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit faire 6 caractères minimum"; // Erreur si le mot de passe est trop court

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est déjà enregistré"; // Erreur si l'email est déjà enregistré

  return errors; // Retour des erreurs formatées
};

// Fonction pour formater les erreurs lors de la connexion
module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" }; // Objet pour stocker les messages d'erreur

  if (err.message.includes("email")) {
    errors.email = "Email inconnu"; // Erreur si l'email n'existe pas
  }

  if (err.message.includes("password")) {
    errors.password = "Le mot de passe ne correspond pas"; // Erreur si le mot de passe est incorrect
  }

  return errors; // Retour des erreurs formatées
};

// Fonction pour formater les erreurs lors des uploads de fichiers
module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" }; // Objet pour stocker les messages d'erreur

  if (err.message.includes("invalid file")) {
    errors.format = "Format incompatible"; // Erreur si le format du fichier est incompatible
  }

  if (err.message.includes("max size")) {
    errors.maxSize = "Le fichier dépasse 500ko"; // Erreur si le fichier dépasse la taille maximale
  }

  return errors; // Retour des erreurs formatées
};

// Ce fichier contient des fonctions pour formater les messages d'erreur lors de l'inscription, de la connexion et des uploads.