# Cheaf Assessment

Proyecto de proceso de selección para Cheaf. Es una simple web que permite al usuario ver productos (sacados de una mock API pública), opción para guardar productos en paquetes (solo para usuario autenticado) con limitaciones para cada tipo de rol, el rol se elige al momento de crear un usuario.

### Roles:
- Vegano
- Frecuente
- Interno
- Visitante solamente para el usuario no autenticado
- Se agrega un nuevo rol "USER" "usuario" para que exista un rol por defecto, en caso de que el usuario no elija uno

### Paquetes:
Los paquetes pueden ser de hasta 4 simultaneamente por temas practicos de este assessment, cada paquete tiene un limite de productos dependiendo del rol, en la lista de products, cada producto tiene un icono de mercado (solo funciona para el usuario autenticado), si el usuario ya tiene paquetes, el icono despliega una lista de los paquetes disponibles y el usuario debe clickear al cual desea agregar el producto seleccionado, caso contrario, el boton simplemente crea el paquete y agrega el producto a ese paquete. Si el producto ya existe en un paquete, el icono tambien debe desplegar la lista de paquetes pero con la opcion de agregar o quitar de uno de ellos. Los paquetes se guardan en firestore.

### Requerimientos que se cumplieron (Explicación)
- Seleccionar o ingresar con un perfil de usuario: Se hace con Firebase.
- Ver los productos y combos disponibles según ese perfil: Algunos productos y paquetes son solo visibles para ciertos roles. Por ejemplo, para el rol 'VEGAN' se filtran los productos para que no se vean carnes, pescados o lacteos. Y para el rol INTERNAL, hay disponible una opcion bonus que permite agregar un paquete especial con productos que nadie mas puede ver, se trata de una API call a la misma API mock pero con data distinta.
- Armar un paquete respetando las reglas de selección para ese usuario: Los roles tienen un límite de 4 paquetes y 4 productos por paquete, excepto para el rol FREQUENT, que tiene límite de 7 para ambos casos
- Mostrar un resumen con el contenido del paquete y el precio total: En la vista `/my-packages` se pueden visualizar todos los paquetes armados y editarlos (solo eliminar productos o paquetes) La única forma de agregar paquetes es desde cada card de producto, en la vista de productos `/products` en el ícono de la card
- Vegano: solo puede elegir productos sin ingredientes de origen animal.
- Cliente frecuente: puede seleccionar hasta 7 productos.
- Promotor interno: tiene acceso a combos especiales no visibles para otros
perfiles.
- Visitante (Usuario NO autenticado): solo puede visualizar los productos, pero no armar paquetes.
- No se deben permitir productos repetidos dentro del mismo paquete.

### Hecho con

- [React & Typescript](https://www.typescriptlang.org/docs/handbook/react.html)
- [Material-ui](https://mui.com/material-ui/getting-started/)

## Requisitos

**Node**
**npm**

## Clonar proyecto

```sh
git clone https://github.com/renatoyanez/cheaf.git && cd cheaf/
```

## Inicializar variables de entorno

Crear archivo `.env` localmente en el root. Debe lucir como el `.env.example` pero con la data que dejo en el email de este assessment.

## Instalar dependencias

```sh
npm install
```

# Scripts

### `npm run dev`

# Estructura

Each app project has the following project structure:

    src
    ├── components
    ├── context
    ├── enums
    ├── firebase
    ├── helpers
    ├── hooks
    ├── layouts
    ├── pages
    ├── types
    App.tsx
    main.tsx
    privateRoute.tsx

- **components**: Libreria de componentes
- **context**: Estados globales y locales segun funcionalidad
- **enums**: Enums para constantes necesarias.
- **firebase**: Lógica de firebase para autenticación y guardado de paquetes en firestore
- **helpers**: Funciones varias que se reutilizan en la app.
- **hooks**: Hooks customizados reutilizables.
- **pages**: Vistas de la app, se rutean.
- **types**: Types para modelar los tipos de datos que se usan en la app.
- **layouts**: Layouts para cubrir distintas vistas


### Disclaimer:
Hubo decisiones "indeseables" durante el desarrollo de este proyecto por cuestiones de tiempo, ya que solo podía trabajar en esto después de mi día laboral y el tiempo era limitado, además había un deadline que cumplir. Ejemplos:
- No todas las tareas o ejecuciones asíncronas tienen manejo apropiado de loaders o error catching, algunos componentes no estan debidamente divididos en archivos más pequeños, la decisión de usar Material-ui fue precisamente para tener componentes estéticos de entrada y no perder tiempo estilizando todo.
- No todas las promesas se manejan de la misma forma, en algunos lugares se usa `try/catch` y en otros `.then()`, esta práctica es un poco desordenada para mi gusto, pero funciona perfectamente bien.
- Solo algunas tareas y efectos en componentes (useEffect) están debidamente memoizados o manejados para cuidar la performance, no me encanta admitirlo, pero el tiempo apremiaba.
- Los archivos de componentes no están capitalizados, esto es más por gustos, no afecta el funcionamiento de nada