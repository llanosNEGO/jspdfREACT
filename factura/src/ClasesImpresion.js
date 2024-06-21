export class Style {
    constructor(size, type, lineHeightFactor = 1.15, align = 'left', heightCorrection = 0.7) {
        this.size = size;
        this.type = type;
        this.lineHeightFactor = lineHeightFactor;
        this.align = align;
        this.heightCorrection = heightCorrection;
    }
}

export class Section {
    /**
     * @param {JsPDF} doc - Objeto JsPDF
     * @param {Number} x - Coordenada X inicial, borde izquierdo
     * @param {Number} y - Coordenada Y inicial, borde superior
     * @param {Style} style - Instancia de Clase `Style`
     * @param {Number} width - ancho de la Sección
     * @param {Number} height - *No se usa aún* alto de la Sección
     * @param {Number} paddingX - margen interno horizontal. *Solo se utiliza para dar margen al dibujar borde*
     * @param {Number} paddingY - margen interno vertical. *Solo se utiliza para dar margen al dibujar borde*
     */
    constructor(
        doc,
        x,
        y,
        style,
        width = null,
        height = null,
        paddingX = 0,
        paddingY = paddingX
    ) {
        this.doc = doc;
        this.style = style;
        this.paddingX = paddingX;
        this.paddingY = paddingY;
        this.flagBorderDrawn = false;
        this.flagFirstDraw = true;

        // Coordenadas donde se va a escribir
        this.x = x + this.paddingX;
        this.y = y + this.paddingY;
        this.width = width && width - this.paddingX * 2;
        if (!this.width) this.fluidWidth = 0;
        // this.height = height && height - this.paddingY * 2;

        // Coordenadas límites de la Sección
        this.startX = x;
        this.startY = y;
        this.endX = this.startX + width;  // En muchos casos `width` es `null`, y `endX` se va actualizando conforme se va escribiendo
        this.endY = this.startY + height; // En muchos casos `height` es `null`, y `endY` se va actualizando conforme se va escribiendo
    }

    /**
     * Escribe un texto o lista de textos dentro de la Sección.
     * Si es una lista de texto, cada texto se imprime en una linea nueva.
     * Si la Sección se construyó con un `width`, los textos que sobrepasan ese ancho
     * se imprime el excedente en una linea nueva.
     *
     * @param {String|Array<String>} data - texto o lista de textos que se van a escribir
     * @param {Style} style - *Opcional*. Usar este estilo en lugar del asignado en la Sección
     */
    write(data, style = this.style) {
        const textList = typeof data === "string" ? [data] : data;
        textList.forEach(text => {
            if (text === null) return;

            // Activar estilos
            const {size, type, lineHeightFactor, align, heightCorrection} = style;
            this.doc.setFontSize(size);
            //this.doc.setFontType(type);
            this.doc.setLineHeightFactor(lineHeightFactor);

            // Corregir altura de texto en la primera escritura del texto
            if (this.flagFirstDraw) {
                this.flagFirstDraw = false;
                // this.doc.line(this.startX, this.y, this.endX, this.y);
                this.y += this.doc.getTextDimensions("T").h * heightCorrection;  // Se le suma la altura de una linea de texto ya que `doc.text()` escribe desde la Coord-Y hacia arriba.;
            }

            let wrappedText;
            if (this.width) {
                // Si está definido un ancho fijo, hacerle *wrap* al texto si se sobresale.
                wrappedText = this.doc.splitTextToSize(text, this.width)
            } else {
                wrappedText = [text];
                // Si no hay ancho fijo, llevar el control del ancho del texto mas largo que se imprima en esta sección
                const currentTextMaxWidth = wrappedText.map(text => this.doc.getTextDimensions(text).w);
                if (currentTextMaxWidth > this.fluidWidth) this.fluidWidth = currentTextMaxWidth;
            }

            // Chequear alineación para definir la coordenadas X desde donde se empezará a escribir
            let x;
            switch (align) {
                case 'right':
                    x = this.x + this.width;
                    break;
                case 'center':
                    x = this.x + this.width / 2;
                    break;
                default:
                    x = this.x;
                    break;
            }

            // Escribir texto
            this.doc.text(wrappedText, x, this.y, {align});
            // this.doc.line(this.startX, this.y, this.endX, this.y);

            // Calcular el alto de una linea
            const lineHeight = lineHeightFactor * this.doc.getTextDimensions(text).h;

            // Actualizar el fin actual de la coordenada Y
            const extraLines = wrappedText.length > 1 ? wrappedText.length - 1 : 0;
            this.endY = this.y + extraLines * lineHeight;
            // Actualizar la coordenada Y para escribir desde una linea nueva
            this.y += lineHeight * wrappedText.length;
        });
    }

    getHeight(text, style = this.style) {
        text = text ? text : ""
        const textList = typeof text === "string" ? [text] : text;
        const {size, type, lineHeightFactor} = style;
        this.doc.setFontSize(size);
        this.doc.setFontType(type);
        this.doc.setLineHeightFactor(lineHeightFactor);

        const totalQuantityLines = textList.reduce((lines, text) => {
            const quantityLines = this.width
                ? this.doc.splitTextToSize(text, this.width).length
                : 1;
            return lines + quantityLines;
        }, 0);

        const lineHeight = lineHeightFactor * this.doc.getTextDimensions("T").h;
        return (totalQuantityLines - 1) * lineHeight;
    }

    calcularLimites() {
        if (this.flagBorderDrawn) throw new Error("Solo se puede calcular los Limites una sola vez.\nEsto ocurre si se intenta dibujar el borde varias veces en el objeto Section.\nOsea en una misma sección no se puede llamar varias veces a `drawBorder()` ni a `drawBox()`")
        this.flagBorderDrawn = true

        const width = this.width || this.fluidWidth;
        this.endX = this.startX + width + this.paddingX * 2;
        this.endY += this.paddingY;
    }

    /**
     * Dibuja el borde a toda la sección.
     * Se debe dibujar de último.
     * @param {*} borderRadiusX - radio de bordeado
     * @param {*} borderRadiusY - *Opcional*. radio de bordeado en Y, y el parámetro anterior afecta al eje X
     */
    drawBox(borderRadiusX, borderRadiusY = borderRadiusX) {
        this.calcularLimites();

        this.doc.roundedRect(
            this.startX,
            this.startY,
            (this.endX - this.startX),
            (this.endY - this.startY),
            borderRadiusX,
            borderRadiusY
        )
    }

    /**
     * Dibuja solo los bordes especificados
     *
     * Esta función recibe 4 parámetros booleanos (uno para cada borde) y 2 son opcionales.
     * Se pueden dar los siguientes casos dependiendo de cuantos parámetros se ingresan:
     * 1. **2 parámetros**: el 1ero indica si se dibujarán los bordes laterales, y el 2do si se dibujaran los bordes superior e inferior.
     * 2. **3 parámetros**: el 1ero indica borde izquierdo, el 2do indica bordes superior e inferior, y 3ero indica borde derecho.
     * 3. **4 parámetros**: 1ero -> izquierdo, 2do -> superior, 3ero -> derecho, 4to -> inferior.
     * @param {Boolean} borderLeft    - Dibujar borde izquierdo, o bordes laterales (verticales)
     * @param {Boolean} borderTop     - Dibujar borde superior, o tambien borde inferior (horizontales)
     * @param {Boolean} borderRight   - Dibujar borde derecho
     * @param {Boolean} borderBottom  - Dibujar borde inferior
     */
    drawBorder(borderLeft, borderTop, borderRight = borderLeft, borderBottom = borderTop) {
        this.calcularLimites();

        if (borderLeft) this.doc.line(this.startX, this.startY, this.startX, this.endY);
        if (borderTop) this.doc.line(this.startX, this.startY, this.endX, this.startY);
        if (borderRight) this.doc.line(this.endX, this.startY, this.endX, this.endY);
        if (borderBottom) this.doc.line(this.startX, this.endY, this.endX, this.endY);
    }
}
