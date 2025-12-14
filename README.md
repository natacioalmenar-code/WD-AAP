<# WEST DIVERS - App Web (V1)

Aplicació web per a gestió del club:
- Usuaris (admin / instructor / soci)
- Sortides / Cursos / Esdeveniments
- Material (recursos del club)
- Mur Social
- Calendari
- Configuració web (logo, títols, fons)

## Rols i permisos

- **Admin**
  - Pot fer-ho tot: aprovar socis/es, assignar rols, canviar configuració web, eliminar contingut.
- **Instructor**
  - Pot crear i gestionar sortides/cursos/esdeveniments i material.
  - No pot assignar rols ni tocar la configuració de la web.
- **Member (Soci/a)**
  - Es pot apuntar a activitats (sense aprovació per apuntar-se).
  - Pot publicar al mur social.
- **Pending**
  - Usuari registrat pendent d’aprovació.

## Flux d’alta de socis/es (recomanat)
1. El soci/a es registra (Accés socis/es).
2. Queda com a **pending**.
3. L’admin entra a **Admin Users** i:
   - Aprova (status active)
   - Assigna rol (member / instructor / admin)

## Material del club
- L’admin/instructor pot:
  - Afegir material
  - Editar/eliminar
  - Marcar com a destacat
  - Ordenar amb ↑ ↓
- Si tens materials antics sense “order”, usa el botó:
  - **Reparar ordre** (1 vegada)

## Mur Social
- Qualsevol usuari actiu pot:
  - Publicar
  - Fer like
  - Comentar
- Admin/instructor pot eliminar qualsevol post
- L’autor pot eliminar el seu post

## Dev local

```bash
npm install
npm run dev
