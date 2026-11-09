/* Predicaciones simuladas tal como las entregaría el reconocimiento de voz de Chrome:
 * en minúsculas, sin puntuación, en fragmentos y con errores típicos de transcripción.
 * "esperado" es lo que una persona pondría en pantalla. */
module.exports = [
  {
    nombre: 'A. Estructurada y limpia (el amor de Dios)',
    esperado: ['El amor de Dios es incondicional', 'El amor de Dios transforma nuestra vida', 'El amor de Dios nos envía a amar a otros'],
    frases: [
      [10, 'buenos días iglesia hoy vamos a hablar del amor de dios abramos la biblia en primera de juan capítulo 4'],
      [40, 'primer punto el amor de dios es incondicional'],
      [46, 'el amor de dios es incondicional no depende de lo que tú hagas'],
      [70, 'dios no te ama porque seas bueno te ama porque él es amor'],
      [130, 'segundo punto el amor de dios transforma nuestra vida'],
      [136, 'anote eso el amor de dios transforma nuestra vida'],
      [220, 'tercer punto el amor de dios nos envía a amar a otros'],
      [250, 'por eso hermanos el amor de dios nos envía a amar a otros a tu vecino a tu familia'],
    ],
  },
  {
    nombre: 'B. Errores de transcripción con palabras reales (la fe)',
    esperado: ['La fe viene por el oír', 'La fe se prueba en el desierto', 'La fe se demuestra con obras'],
    frases: [
      [30, 'en primer lugar la fe viene por el oír'],
      [45, 'la fe viene por el oír y el oír por la palabra de dios'],
      [120, 'en segundo lugar la fe se prueba en el de cierto'],
      [150, 'porque la fe se prueba en el desierto hermanos ahí es donde crece'],
      [230, 'y en tercer lugar la fe se demuestra con sobras'],
      [245, 'una fe sin sobras está muerta dice santiago'],
    ],
  },
  {
    nombre: 'C. Sin marcadores explícitos (la oración)',
    esperado: ['La oración nos acerca a Dios', 'La oración cambia nuestro corazón', 'La oración abre puertas'],
    frases: [
      [20, 'hoy quiero que veamos tres cosas sobre la oración'],
      [35, 'la oración nos acerca a dios cuando oras estás entrando a su presencia'],
      [120, 'también la oración cambia nuestro corazón no cambia a dios te cambia a ti'],
      [210, 'y la oración abre puertas que nadie puede cerrar'],
    ],
  },
  {
    nombre: 'D. Muletillas e interrupciones (el perdón)',
    esperado: ['El perdón libera', 'La amargura te enferma', 'Perdonar no es olvidar, es soltar'],
    frases: [
      [15, 'primer punto eh este mire anote el perdón libera'],
      [20, 'el perdón libera hermano el perdón te hace libre'],
      [110, 'segundo punto y esto es importante escuchen bien la amargura te enferma'],
      [118, 'la amargura te enferma hermanos la amargura te roba la paz'],
      [200, 'tercer punto perdonar no es olvidar es soltar'],
    ],
  },
  {
    nombre: 'E. Falsa alarma (no es un punto de la enseñanza)',
    esperado: [],
    frases: [
      [5, 'en primer lugar quiero agradecer a los hermanos de la alabanza'],
      [60, 'bueno vamos a orar por las peticiones de la semana'],
      [120, 'la última cosa antes de empezar apaguen los celulares por favor'],
    ],
  },
];
