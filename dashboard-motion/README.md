# OPS dashboard motion

Compositions HyperFrames autonomes :

- `index.html` — 1536 × 1020, composition `ops-dashboard-motion` ;
- `mobile/index.html` — 780 × 1392, composition `ops-dashboard-mobile`.

Chaque fichier contient une timeline GSAP unique, pausée et seek-safe. Le rendu critique reste piloté par HyperFrames. La landing instancie une seule variante quand la section devient visible, puis laisse le lecteur boucler.

Les deux variantes durent 20 secondes à 30 fps. Les huit bulles restent visibles pendant plus de sept secondes, puis le cockpit disparaît progressivement avant de reprendre sans coupure sèche.
