const FontSize = {
    /**
     * El `font-size` mas pequeño del programa.
     * @readonly
     */
    SM: "var(--font-size-sm)",

    /**
     * Un `font-size` mas grande que `SM`, ideal para titulos pequeños.
     * @readonly
     */
    MD: "var(--font-size-md)",

    /**
     * Es un `font-size` grande.
     * @readonly
     */
    LG: "var(--font-size-lg)",

    /**
     * Deberia ser el `font-size` menos usado, ya que es el intermedio de todo.
     * @readonly
     */
    XL1: "var(--font-size-xl1)",

    /**
     * Un `font-size` ideal para titulos grandes.
     * @readonly
     */
    XL2: "var(--font-size-xl2)",

    /**
     * Este `font-size` se deberia utilizar en titulos importantes.
     * @readonly
     */
    XL3: "var(--font-size-xl3)"
};

Object.freeze(FontSize);

export default FontSize;