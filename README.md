# LotoBingo

Application web de gestion de loto/bingo en temps réel, conçue pour les associations, clubs et événements.

[English version below](#english)

---

## Fonctionnalités

### Gestion des tirages (Admin)
- Création et gestion de plusieurs parties de bingo
- Tirage manuel ou aléatoire des numéros
- Historique des numéros tirés
- Synchronisation temps réel avec l'affichage client via WebSocket
- Réorganisation des parties par glisser-déposer

### Affichage client
- Affichage plein écran pour projection
- Animation des boules tirées
- Mise à jour automatique en temps réel
- Reconnexion automatique en cas de perte de connexion

### Gestion des lots
- Création de lots avec nom, valeur et photo
- Attribution des lots aux parties
- Affichage du lot en cours sur l'écran client

### Cartons de bingo
- Génération de cartons 75 boules (américain) ou 90 boules (européen)
- Génération en lot (jusqu'à 3000 cartons)
- Personnalisation des couleurs et styles
- Mode uniforme ou aléatoire pour les styles

## Technologies

- **Nuxt 3** - Framework Vue.js full-stack
- **Vue 3** - Framework JavaScript progressif
- **Pinia** - Gestion d'état
- **TypeScript** - Typage statique
- **WebSocket** - Communication temps réel
- **Vitest** - Tests unitaires

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/lotobingo.git
cd lotobingo

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Construire pour la production
npm run build

# Lancer les tests
npm run test
```

## Utilisation

1. **Configuration** : Accédez à `/settings` pour créer vos parties et lots
2. **Administration** : Utilisez `/loto/admin` pour gérer les tirages
3. **Affichage** : Ouvrez `/loto/client` sur l'écran de projection
4. **Cartons** : Générez et personnalisez vos cartons via `/cards`

## Structure du projet

```
app/
├── pages/           # Pages Nuxt (routage automatique)
├── components/      # Composants Vue réutilisables
├── stores/          # Stores Pinia (état global)
├── composables/     # Composables Vue (logique réutilisable)
├── types/           # Types TypeScript
└── utils/           # Fonctions utilitaires
```

## Contribution

Les contributions sont les bienvenues ! Veuillez consulter les issues ouvertes ou en créer une nouvelle pour discuter des modifications souhaitées.

## Licence

Ce projet est sous licence **AGPL-3.0** (GNU Affero General Public License v3.0).

### Ce que cela signifie :

**Vous pouvez :**
- Utiliser ce logiciel gratuitement pour vos événements (y compris à but lucratif)
- Modifier le code source
- Distribuer le logiciel

**Vous devez :**
- Garder le code source ouvert et accessible
- Distribuer vos modifications sous la même licence AGPL-3.0
- Mentionner les modifications apportées
- Inclure la licence et le copyright original

**Vous ne pouvez pas :**
- Vendre ce logiciel ou une version modifiée comme produit propriétaire
- Fermer le code source de vos modifications

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

# English

## Features

### Draw Management (Admin)
- Create and manage multiple bingo games
- Manual or random number drawing
- History of drawn numbers
- Real-time synchronization with client display via WebSocket
- Drag-and-drop game reordering

### Client Display
- Full-screen display for projection
- Animated ball drawing
- Automatic real-time updates
- Auto-reconnection on connection loss

### Prize Management
- Create prizes with name, value, and photo
- Assign prizes to games
- Display current prize on client screen

### Bingo Cards
- Generate 75-ball (American) or 90-ball (European) cards
- Batch generation (up to 3000 cards)
- Customize colors and styles
- Uniform or random style distribution

## Tech Stack

- **Nuxt 3** - Full-stack Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **Pinia** - State management
- **TypeScript** - Static typing
- **WebSocket** - Real-time communication
- **Vitest** - Unit testing

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lotobingo.git
cd lotobingo

# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Usage

1. **Configuration**: Go to `/settings` to create your games and prizes
2. **Administration**: Use `/loto/admin` to manage draws
3. **Display**: Open `/loto/client` on the projection screen
4. **Cards**: Generate and customize your cards via `/cards`

## Project Structure

```
app/
├── pages/           # Nuxt pages (auto-routing)
├── components/      # Reusable Vue components
├── stores/          # Pinia stores (global state)
├── composables/     # Vue composables (reusable logic)
├── types/           # TypeScript types
└── utils/           # Utility functions
```

## Contributing

Contributions are welcome! Please check open issues or create a new one to discuss desired changes.

## License

This project is licensed under **AGPL-3.0** (GNU Affero General Public License v3.0).

### What this means:

**You can:**
- Use this software for free for your events (including for-profit)
- Modify the source code
- Distribute the software

**You must:**
- Keep the source code open and accessible
- Distribute your modifications under the same AGPL-3.0 license
- State changes made
- Include the original license and copyright

**You cannot:**
- Sell this software or a modified version as a proprietary product
- Close the source code of your modifications

See the [LICENSE](LICENSE) file for details.

---

## Author

Développé avec passion pour la communauté associative.

*Built with love for community organizations.*
