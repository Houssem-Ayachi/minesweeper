export default class UI{

    private static _uiElements: Element[] = [];
    
    private static _container: Element;

    static addUIContainer(element: Element){
        this._container = element;
    }

    static addUiElement(name: string, title: string, value: string){
        const element = document.createElement("h3");
        element.innerText = `${title}: ${value}`;
        element.setAttribute("name", name);
        element.setAttribute("title", title);
        this._uiElements.push(element);
        if(this._container){
            this._container.appendChild(element);
        }
        return element;
    }

    static updateElement(name: string, newValue: string){
        for(let element of this._uiElements){
            const [eName, eTitle] = element.attributes
            if(eName.value === name){
                const title = eTitle.value;
                element.innerHTML = `${title}: ${newValue}`;
                return;
            }
        }
    }

    static flushElements(){
        for(let node of this._container.childNodes){
            this._container.removeChild(node);
        }
        this._uiElements = [];
    }
}