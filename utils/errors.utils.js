// Erreurs d'authentification
module.exports.signUpErrors = (err) => {
  const errors = { email: "", password: "" };

  if (err.message.includes("email")) {
    errors.email = "Format d'email invalide";
  }

  if (err.message.includes("password")) {
    errors.password = "Le mot de passe doit faire 6 caractères minimum";
  }

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email")) {
    errors.email = "Cet email est déjà enregistré";
  }

  return errors;
};

module.exports.signInErrors = (err) => {
  const errors = { email: "", password: "" };

  if (err.message.includes("Email non trouvé")) {
    errors.email = "Email inconnu";
  }

  if (err.message.includes("Mot de passe incorrect")) {
    errors.password = "Mot de passe incorrect";
  }

  return errors;
};

// Erreurs de fichiers
module.exports.uploadErrors = (err) => {
  const errors = {
    format: "",
    maxSize: "",
    server: ""
  };

  if (err.message.includes("Format de fichier non autorisé")) {
    errors.format = "Format non autorisé (JPEG, PNG ou GIF uniquement)";
  }

  if (err.message.includes("Taille maximale")) {
    errors.maxSize = "Le fichier dépasse la taille maximale (10MB)";
  }

  if (err.message.includes("ENOENT") || err.message.includes("EACCES")) {
    errors.server = "Erreur lors de l'enregistrement du fichier";
  }

  // Si aucune erreur spécifique n'est trouvée
  if (!errors.format && !errors.maxSize && !errors.server) {
    errors.server = "Une erreur est survenue lors de l'upload";
  }

  return errors;
};

// Erreurs de validation MongoDB
module.exports.mongooseErrors = (err) => {
  const errors = {};

  if (err.name === "ValidationError") {
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }

  return errors;
};

// Erreurs génériques
module.exports.handleErrors = (err) => {
  if (err.name === "CastError") {
    return "ID invalide";
  }

  if (err.name === "ValidationError") {
    return "Données invalides";
  }

  return "Une erreur est survenue";
};

// Ce fichier contient des fonctions pour formater les messages d'erreur lors de l'inscription, de la connexion et des uploads.