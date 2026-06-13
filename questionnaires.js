// Définition des 4 questionnaires + bloc de questions communes "Top 5"
// Types de champs supportés : text, email, number, date, textarea,
// select, select_other (select + champ "précisez"), radio, checkbox (multi)

const BIG5 = {
  title: "Les 5 questions essentielles",
  questions: [
    { id: "big5_parcours", label: "Racontez-nous votre parcours depuis le début (étapes clés, ressentis, rencontres...)", type: "textarea" },
    { id: "big5_difficulte", label: "Quelle a été votre plus grande difficulté ?", type: "textarea" },
    { id: "big5_manque", label: "Qu'est-ce qui vous a le plus manqué jusqu'ici ?", type: "textarea" },
    { id: "big5_depense", label: "Combien avez-vous déjà dépensé, approximativement, sur l'ensemble de ce sujet ?", type: "text" },
    { id: "big5_service_parfait", label: "Si vous pouviez créer le service parfait, à quoi ressemblerait-il ?", type: "textarea" }
  ]
};

const CSP_OPTIONS = [
  "Agriculteur exploitant",
  "Artisan, commerçant, chef d'entreprise",
  "Cadre / profession intellectuelle supérieure",
  "Profession intermédiaire",
  "Employé",
  "Ouvrier",
  "Retraité",
  "Sans activité professionnelle",
  "Étudiant"
];

const NIVEAU_ETUDE_OPTIONS = [
  "Sans diplôme",
  "CAP / BEP",
  "Baccalauréat",
  "Bac+2 / Bac+3",
  "Bac+4 / Bac+5",
  "Bac+5 et plus (master, doctorat...)"
];

const AGE_OPTIONS = [
  "Moins de 18 ans",
  "18-24 ans",
  "25-34 ans",
  "35-44 ans",
  "45-54 ans",
  "55-64 ans",
  "65 ans et plus"
];

const QUESTIONNAIRES = [
  // =========================================================
  // 1. PARENTS D'ENFANTS NEUROATYPIQUES
  // =========================================================
  {
    id: "parents",
    title: "Parents d'enfants neuroatypiques",
    description: "Pour les parents d'un enfant TDAH, TSA, Dys, HPI ou en cours de diagnostic.",
    color: "#3D8BFD",
    sections: [
      {
        title: "À propos de vous",
        questions: [
          { id: "email", label: "Votre adresse e-mail (facultatif, pour vous tenir informé·e)", type: "email" },
          { id: "parent_age", label: "Votre âge", type: "select", options: AGE_OPTIONS },
          { id: "ville", label: "Votre ville de résidence", type: "text" },
          { id: "csp", label: "Votre catégorie socio-professionnelle", type: "select_other", options: CSP_OPTIONS },
          { id: "niveau_etude", label: "Votre niveau d'études", type: "select", options: NIVEAU_ETUDE_OPTIONS },
          { id: "situation_familiale", label: "Votre situation familiale", type: "select_other", options: ["En couple", "Famille monoparentale", "Garde alternée"] },
          { id: "nb_enfants", label: "Nombre d'enfants dans le foyer", type: "number" }
        ]
      },
      {
        title: "Profil de l'enfant",
        questions: [
          { id: "age_enfant", label: "Quel âge a votre enfant ?", type: "number" },
          { id: "sexe_enfant", label: "Sexe de l'enfant", type: "select", options: ["Garçon", "Fille", "Autre / ne souhaite pas répondre"] },
          { id: "diagnostic", label: "Quel est son diagnostic ?", type: "select_other", options: ["TDAH", "TSA", "Dys (dyslexie, dyspraxie, dyscalculie...)", "HPI", "En cours de diagnostic", "Plusieurs diagnostics associés"] },
          { id: "duree_situation", label: "Depuis combien de temps êtes-vous confronté à cette situation ?", type: "text" }
        ]
      },
      {
        title: "Diagnostic",
        questions: [
          { id: "duree_diagnostic", label: "Combien de temps a-t-il fallu pour obtenir un diagnostic ?", type: "text" },
          { id: "difficultes_diagnostic", label: "Quelles ont été les principales difficultés rencontrées pour obtenir ce diagnostic ?", type: "textarea" },
          { id: "cout_diagnostic", label: "Quel a été le coût total approximatif du diagnostic ?", type: "text" }
        ]
      },
      {
        title: "Parcours de soins",
        questions: [
          { id: "professionnels_actuels", label: "Quels professionnels consultez-vous aujourd'hui ?", type: "checkbox", options: ["Pédopsychiatre", "Psychologue", "Neuropsychologue", "Orthophoniste", "Psychomotricien", "Ergothérapeute", "Médecin généraliste / pédiatre", "Éducateur spécialisé", "Aucun actuellement"] },
          { id: "depense_mensuelle", label: "Combien dépensez-vous par mois pour l'accompagnement de votre enfant ?", type: "select_other", options: ["Moins de 50 €", "50 à 150 €", "150 à 300 €", "300 à 500 €", "Plus de 500 €"] },
          { id: "services_non_rembourses", label: "Quels services ne sont pas remboursés par la Sécurité Sociale / mutuelle ?", type: "textarea" }
        ]
      },
      {
        title: "École",
        questions: [
          { id: "ecole_comprehension", label: "L'école comprend-elle les besoins de votre enfant ?", type: "radio", options: ["Très bien", "Plutôt bien", "Plutôt mal", "Pas du tout", "Ne se prononce pas (pas encore scolarisé)"] },
          { id: "difficultes_education_nationale", label: "Avez-vous rencontré des difficultés avec l'Éducation nationale ? Lesquelles ?", type: "textarea" },
          { id: "aides_utiles_ecole", label: "Quelles aides auraient été les plus utiles à l'école ?", type: "textarea" }
        ]
      },
      {
        title: "Vie familiale",
        questions: [
          { id: "plus_grand_stress", label: "Quelle est aujourd'hui votre plus grande source de stress ?", type: "textarea" },
          { id: "plus_grand_manque", label: "Qu'est-ce qui vous a le plus manqué depuis le début du parcours ?", type: "textarea" }
        ]
      },
      {
        title: "Maison de la Neurodiversité",
        questions: [
          { id: "services_souhaites_maison", label: "Si un lieu unique existait, quels services souhaiteriez-vous y trouver ?", type: "checkbox", options: ["Diagnostic pluridisciplinaire", "Suivi thérapeutique régulier", "Groupes de parole pour parents", "Activités pour les enfants", "Information / formation sur la neurodiversité", "Soutien administratif (MDPH, dossiers...)", "Garde / répit pour les parents", "Autre"] },
          { id: "frequence_visite", label: "À quelle fréquence viendriez-vous ?", type: "select", options: ["Plusieurs fois par semaine", "Une fois par semaine", "Une à deux fois par mois", "Quelques fois par an", "Jamais"] },
          { id: "abonnement_pret", label: "Seriez-vous prêt à payer un abonnement pour accéder à ces services ?", type: "radio", options: ["Oui", "Non", "Peut-être"] },
          { id: "montant_abonnement", label: "Si oui, combien par mois ?", type: "radio", options: ["10 €", "25 €", "50 €", "100 € et plus", "Non concerné"] }
        ]
      },
      BIG5
    ]
  },

  // =========================================================
  // 2. ADULTES NEUROATYPIQUES
  // =========================================================
  {
    id: "adultes",
    title: "Adultes neuroatypiques",
    description: "Pour les adultes diagnostiqués ou se reconnaissant TDAH, TSA, Dys, HPI...",
    color: "#5BC0BE",
    sections: [
      {
        title: "À propos de vous",
        questions: [
          { id: "email", label: "Votre adresse e-mail (facultatif)", type: "email" },
          { id: "age", label: "Votre âge", type: "select", options: AGE_OPTIONS },
          { id: "genre", label: "Vous êtes", type: "select_other", options: ["Une femme", "Un homme", "Préfère ne pas répondre"] },
          { id: "ville", label: "Votre ville de résidence", type: "text" },
          { id: "csp", label: "Votre catégorie socio-professionnelle", type: "select_other", options: CSP_OPTIONS },
          { id: "niveau_etude", label: "Votre niveau d'études", type: "select", options: NIVEAU_ETUDE_OPTIONS },
          { id: "situation_pro", label: "Votre situation professionnelle", type: "select_other", options: ["Salarié·e", "Indépendant·e / freelance", "Étudiant·e", "Sans emploi", "Retraité·e"] }
        ]
      },
      {
        title: "Diagnostic",
        questions: [
          { id: "profil", label: "Quel est votre profil ?", type: "select_other", options: ["TDAH", "TSA / Autisme", "Dys (dyslexie, dyspraxie, dyscalculie...)", "HPI", "Plusieurs profils associés", "Non diagnostiqué mais en cours de questionnement"] },
          { id: "age_diagnostic", label: "À quel âge avez-vous été diagnostiqué ?", type: "number" },
          { id: "attente_diagnostic", label: "Combien de temps avez-vous attendu avant d'obtenir une réponse ?", type: "text" }
        ]
      },
      {
        title: "Vie professionnelle",
        questions: [
          { id: "neurodiv_pro", label: "Votre neurodiversité est-elle un avantage ou un frein dans votre travail ?", type: "radio", options: ["Plutôt un avantage", "Plutôt un frein", "Les deux à la fois", "Aucun impact"] },
          { id: "cache_situation", label: "Avez-vous déjà caché votre situation à votre employeur ou vos collègues ?", type: "radio", options: ["Oui, systématiquement", "Oui, parfois", "Non, jamais", "Non concerné"] }
        ]
      },
      {
        title: "Difficultés du quotidien",
        questions: [
          { id: "defis_quotidiens", label: "Quels sont vos principaux défis au quotidien ?", type: "textarea" },
          { id: "services_utilises", label: "Quels services utilisez-vous aujourd'hui ?", type: "checkbox", options: ["Psychologue / thérapeute", "Coach spécialisé", "Médicaments", "Applications / outils numériques", "Groupes de soutien / communautés", "Aucun"] }
        ]
      },
      {
        title: "Dépenses",
        questions: [
          { id: "depense_annuelle", label: "Combien dépensez-vous par an pour votre développement personnel ou votre accompagnement (thérapies, coaching, formations...) ?", type: "select_other", options: ["Moins de 100 €", "100 à 500 €", "500 à 1 000 €", "1 000 à 3 000 €", "Plus de 3 000 €"] }
        ]
      },
      {
        title: "Besoins",
        questions: [
          { id: "service_reve", label: "Quel service rêveriez-vous de trouver ?", type: "textarea" },
          { id: "pret_a_payer_accompagnement", label: "Seriez-vous prêt à payer pour un accompagnement spécialisé (coaching, groupe de pairs, suivi...) ?", type: "radio", options: ["Oui", "Non", "Peut-être"] },
          { id: "montant_mensuel_accompagnement", label: "Si oui, combien par mois ?", type: "radio", options: ["10 €", "25 €", "50 €", "100 € et plus", "Non concerné"] }
        ]
      },
      BIG5
    ]
  },

  // =========================================================
  // 3. EMPLOYEURS ET DRH
  // =========================================================
  {
    id: "drh",
    title: "Employeurs et DRH",
    description: "Pour les responsables RH, dirigeants ou managers.",
    color: "#9D6FFB",
    sections: [
      {
        title: "À propos de vous",
        questions: [
          { id: "email", label: "Votre adresse e-mail (facultatif)", type: "email" },
          { id: "fonction", label: "Votre fonction dans l'entreprise", type: "text" },
          { id: "secteur_activite", label: "Secteur d'activité de l'entreprise", type: "text" },
          { id: "ville_entreprise", label: "Ville / région de l'entreprise", type: "text" }
        ]
      },
      {
        title: "Organisation",
        questions: [
          { id: "taille_entreprise", label: "Taille de votre entreprise", type: "select", options: ["1 à 9 salariés", "10 à 49 salariés", "50 à 249 salariés", "250 à 999 salariés", "1 000 salariés et plus"] },
          { id: "politique_nd", label: "Disposez-vous d'une politique Neurodiversité ?", type: "radio", options: ["Oui, formalisée", "Oui, de manière informelle", "Non, mais en réflexion", "Non"] }
        ]
      },
      {
        title: "Recrutement",
        questions: [
          { id: "recrute_profils_na", label: "Recrutez-vous des profils neuroatypiques (déclarés ou non) ?", type: "radio", options: ["Oui, régulièrement", "Oui, occasionnellement", "Non, jamais", "Je ne sais pas"] },
          { id: "difficultes_recrutement", label: "Quelles difficultés rencontrez-vous dans ce domaine ?", type: "textarea" }
        ]
      },
      {
        title: "Management",
        questions: [
          { id: "managers_formes", label: "Vos managers sont-ils formés à la neurodiversité ?", type: "radio", options: ["Oui", "Non", "Partiellement"] },
          { id: "situation_complexe", label: "Avez-vous déjà vécu une situation complexe liée à la neurodiversité dans votre entreprise ? Racontez.", type: "textarea" }
        ]
      },
      {
        title: "Budget",
        questions: [
          { id: "budget_di", label: "Disposez-vous d'un budget Diversité & Inclusion ?", type: "radio", options: ["Oui", "Non", "Je ne sais pas"] },
          { id: "budget_formation", label: "Quel budget annuel pourriez-vous consacrer à la formation ?", type: "select_other", options: ["Aucun", "Moins de 1 000 €", "1 000 à 5 000 €", "5 000 à 20 000 €", "Plus de 20 000 €"] },
          { id: "budget_coaching", label: "Quel budget annuel pourriez-vous consacrer au coaching ?", type: "select_other", options: ["Aucun", "Moins de 1 000 €", "1 000 à 5 000 €", "5 000 à 20 000 €", "Plus de 20 000 €"] },
          { id: "budget_diagnostic_orga", label: "Quel budget annuel pourriez-vous consacrer à un diagnostic organisationnel ?", type: "select_other", options: ["Aucun", "Moins de 1 000 €", "1 000 à 5 000 €", "5 000 à 20 000 €", "Plus de 20 000 €"] },
          { id: "budget_recrutement", label: "Quel budget annuel pourriez-vous consacrer au recrutement spécialisé ?", type: "select_other", options: ["Aucun", "Moins de 1 000 €", "1 000 à 5 000 €", "5 000 à 20 000 €", "Plus de 20 000 €"] }
        ]
      },
      {
        title: "Intérêt pour la Maison de la Neurodiversité",
        questions: [
          { id: "partenariat_maison", label: "Une Maison de la Neurodiversité pourrait-elle être un partenaire de votre entreprise ?", type: "radio", options: ["Oui, certainement", "Oui, peut-être", "Non", "Je ne sais pas"] },
          { id: "services_interessants_drh", label: "Quels services vous intéresseraient le plus ?", type: "checkbox", options: ["Sensibilisation / formation des équipes", "Accompagnement RH au recrutement inclusif", "Coaching individuel pour salariés neuroatypiques", "Diagnostic organisationnel", "Mise en relation avec des candidats", "Conseil juridique / aménagements de poste", "Autre"] }
        ]
      },
      BIG5
    ]
  },

  // =========================================================
  // 4. PROFESSIONNELS DE SANTÉ ET ASSOCIATIONS
  // =========================================================
  {
    id: "pro",
    title: "Professionnels de santé et associations",
    description: "Pour les médecins, paramédicaux, psychologues et responsables associatifs.",
    color: "#FF8C5A",
    sections: [
      {
        title: "À propos de vous",
        questions: [
          { id: "email", label: "Votre adresse e-mail (facultatif)", type: "email" },
          { id: "ville_exercice", label: "Ville / région d'exercice", type: "text" },
          { id: "type_structure", label: "Type de structure", type: "select_other", options: ["Cabinet libéral", "Hôpital / clinique", "Centre médico-psychologique / CMP / CMPP", "Association", "Établissement scolaire / médico-social"] },
          { id: "annees_experience", label: "Nombre d'années d'expérience", type: "number" }
        ]
      },
      {
        title: "Activité",
        questions: [
          { id: "specialite", label: "Quelle est votre spécialité ?", type: "select_other", options: ["Médecin généraliste", "Pédopsychiatre / psychiatre", "Psychologue / neuropsychologue", "Orthophoniste", "Psychomotricien", "Ergothérapeute", "Éducateur spécialisé", "Responsable associatif"] },
          { id: "principal_probleme_patients", label: "Quel est aujourd'hui le principal problème rencontré par vos patients / bénéficiaires ?", type: "textarea" }
        ]
      },
      {
        title: "Capacité d'accueil",
        questions: [
          { id: "delai_attente", label: "Quel est votre délai moyen d'attente pour un nouveau patient ?", type: "select", options: ["Moins d'1 mois", "1 à 3 mois", "3 à 6 mois", "6 à 12 mois", "Plus de 12 mois"] },
          { id: "refus_patients", label: "Refusez-vous des patients faute de disponibilité ?", type: "radio", options: ["Oui, régulièrement", "Oui, parfois", "Non"] }
        ]
      },
      {
        title: "Manques de l'écosystème",
        questions: [
          { id: "manques_ecosysteme", label: "Qu'est-ce qui manque aujourd'hui dans l'écosystème selon vous ?", type: "textarea" },
          { id: "services_a_developper", label: "Quels services souhaiteriez-vous voir développés ?", type: "textarea" }
        ]
      },
      {
        title: "Partenariats",
        questions: [
          { id: "orienter_vers_maison", label: "Seriez-vous prêt à orienter vos patients vers une Maison de la Neurodiversité ?", type: "radio", options: ["Oui", "Non", "Peut-être"] },
          { id: "conditions_partenariat", label: "Sous quelles conditions ?", type: "textarea" }
        ]
      },
      BIG5
    ]
  }
];
