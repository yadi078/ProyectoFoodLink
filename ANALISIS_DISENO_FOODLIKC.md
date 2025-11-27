# 📐 Análisis de Diseño - FoodlikC

## 🎨 Paleta de Colores

### Colores Principales

- **Color Primario (Naranja)**: `#fbaf32`
  - Usado en: botones principales, enlaces, acentos, logo
  - Hover/Estados activos
- **Color Secundario (Verde Oliva)**: `#719a0a`
  - Usado en: botones secundarios, estados hover, acentos secundarios
  - Logo "Link" parte del nombre

### Colores Neutros

- **Texto Principal**: `#454545` (gris oscuro)
- **Texto Secundario**: `#757575` (gris medio)
- **Fondo Principal**: `#ffffff` (blanco)
- **Fondo Secundario**: `rgba(0, 0, 0, .04)` (gris muy claro)
- **Bordes**: `#cccccc`, `#dddddd`
- **Navbar sticky**: `#666666`

### Colores Especiales

- **Overlay carousel**: `rgba(0, 0, 0, 0.6)`
- **Sombras**: `rgba(0, 0, 0, .08)`, `rgba(0, 0, 0, .04)`
- **Texto blanco**: `#ffffff`

## 🔤 Tipografía

### Fuentes

1. **Fuente Principal (Cuerpo de texto)**:
   - `'Open Sans', sans-serif`
   - Pesos: 300 (light), 400 (regular)
2. **Fuente de Títulos y Enlaces**:
   - `'Nunito', sans-serif`
   - Pesos: 600 (semi-bold), 700 (bold)

### Tamaños de Fuente

- **H1** (Carousel): 60px (desktop), 35px (tablet), 30px (móvil), 25px (móvil pequeño)
- **H2** (Títulos principales): 45px → 40px → 35px → 30px (responsivo)
- **H3**: 22px-30px
- **Párrafos**: 16px-20px
- **Enlaces**: 18px (navbar), 16px (general)

### Google Fonts Import

```html
<link
  href="https://fonts.googleapis.com/css?family=Open+Sans:300,400|Nunito:600,700"
  rel="stylesheet"
/>
```

## 🎭 Estilos y Diseño

### Bordes Redondeados

- **Pequeño**: `5px` - botones, inputs, badges
- **Mediano**: `15px` - cards, imágenes, secciones
- **Circular**: `50px` / `100px` - avatares, iconos circulares

### Sombras

- **Cards suaves**: `0 0 30px rgba(0, 0, 0, .08)`
- **Fondos sutiles**: `rgba(0, 0, 0, .04)`
- **Navbar sticky**: `0 2px 5px rgba(0, 0, 0, .3)`

### Transiciones

- **Rápidas**: `0.3s` - hover, cambios de color
- **Medias**: `0.5s` - cambios de fondo, transformaciones

### Espaciado

- **Padding secciones**: 45px, 90px
- **Margin entre elementos**: 15px, 30px, 45px
- **Container max-width**: 1366px

### Componentes Especiales

#### Navbar

- **Posición**: absoluta inicialmente, fija al hacer scroll (nav-sticky)
- **Fondo transparente** en hero, **blanco** cuando sticky
- **Links**: blancos en hero, grises cuando sticky
- **Activo**: color naranja `#fbaf32`
- **Logo**: "Food" en naranja, "Link" en verde

#### Botones (custom-btn)

- **Padding**: `12px 25px`
- **Fondo**: `#fbaf32` (naranja)
- **Texto**: `#ffffff` (blanco)
- **Borde**: `2px solid #fbaf32`
- **Hover**: fondo transparente, texto naranja
- **Border radius**: `5px`

#### Carousel/Hero

- **Altura**: `100vh`
- **Overlay oscuro**: `rgba(0, 0, 0, 0.6)`
- **Texto centrado**: blanco
- **Botón secundario**: fondo verde `#719a0a`

#### Cards/Tarjetas

- **Fondo**: blanco
- **Padding**: 30px-50px
- **Border radius**: 15px
- **Sombra suave**: `0 0 30px rgba(0, 0, 0, .08)`
- **Hover**: sombra se reduce o desaparece

#### Secciones

- **Fondos alternados**: blanco y `rgba(0, 0, 0, .04)`
- **Títulos de sección**: "p" en verde `#719a0a`, "h2" en gris oscuro `#454545`

#### Iconos (Flaticon)

- **Color**: naranja `#fbaf32`
- **Hover**: verde `#719a0a`
- **Tamaño**: 60px (feature items)

#### Footer

- **Fondo**: `rgba(0, 0, 0, .04)`
- **Títulos**: naranja con línea verde debajo
- **Copyright**: fondo blanco
- **Social icons**: círculos naranjas, hover verde

## 🎯 Patrones de Diseño

### Gradientes

- **Iconos feature**: gradiente lineal de verde a naranja
  ```css
  background-image: linear-gradient(#719a0a, #fbaf32);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ```

### Efectos Hover

- **Escala de imágenes**: `transform: scale(1.1)`
- **Cambio de color**: naranja → verde
- **Reducción de sombra**: para dar sensación de elevación

### Responsive Breakpoints

- **Desktop**: `min-width: 992px`
- **Tablet**: `max-width: 991.98px`
- **Mobile**: `max-width: 767.98px`
- **Mobile pequeño**: `max-width: 575.98px`

## 📦 Librerías y Frameworks

- **Bootstrap 4.4.1**
- **Font Awesome 5.10.0**
- **Owl Carousel**
- **Animate.css**
- **Flaticon**

## 🎨 Resumen de Colores para Tailwind

```javascript
colors: {
  primary: {
    DEFAULT: '#fbaf32',  // Naranja principal
    600: '#fbaf32',
  },
  secondary: {
    DEFAULT: '#719a0a',  // Verde oliva
    600: '#719a0a',
  },
  gray: {
    DEFAULT: '#454545',  // Texto principal
    600: '#757575',      // Texto secundario
    400: '#999999',
    300: '#cccccc',
    200: '#dddddd',
  }
}
```

## 📝 Notas de Implementación

1. **Logo**: Usar colores diferenciados - "Food" en naranja, "Link" en verde
2. **Navbar**: Transparente en hero, blanco cuando sticky
3. **Botones primarios**: Naranja sólido, hover con borde naranja y fondo transparente
4. **Botones secundarios**: Verde, mismo comportamiento hover
5. **Cards**: Fondo blanco con sombras suaves y border-radius 15px
6. **Transiciones**: Suaves (0.3s-0.5s) para todos los cambios de estado
7. **Iconos**: Usar gradiente verde-naranja en elementos destacados
