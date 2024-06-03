export default class UI {
    static addUIContainer(element) {
        this._container = element;
    }
    static addUiElement(name, title, value) {
        const element = document.createElement("h3");
        element.innerText = `${title}: ${value}`;
        element.setAttribute("name", name);
        element.setAttribute("title", title);
        this._uiElements.push(element);
        if (this._container) {
            this._container.appendChild(element);
        }
        return element;
    }
    static updateElement(name, newValue) {
        for (let element of this._uiElements) {
            const [eName, eTitle] = element.attributes;
            if (eName.value === name) {
                const title = eTitle.value;
                element.innerHTML = `${title}: ${newValue}`;
                return;
            }
        }
    }
    static flushElements() {
        for (let node of this._container.childNodes) {
            this._container.removeChild(node);
        }
        this._uiElements = [];
    }
}
UI._uiElements = [];
