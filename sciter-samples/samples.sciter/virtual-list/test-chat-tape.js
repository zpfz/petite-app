import * as DS from "test-chat-data-source.js";

class MineItem extends Element {
    render(prop) {
        const item = prop.item;
        return <div mine="" >
            <div.text state-html={item.html} />
            <img src={ item.avatar } /></div>;
    }
}

class TheirItem extends Element {
    render(prop) {
        const item = prop.item;
        return <div>
            <img src={ item.avatar } />
            <div.text state-html={item.html} /></div>;
    }
}

function Item(props) {
    if (props.genId) {
        if (props.item.mine)
            return <MineItem #test item={props.item} />;
        else
            return <TheirItem #test item={props.item} />;
    }
    if (props.item.mine)
        return <MineItem item={props.item} />;
    else
        return <TheirItem item={props.item} />;
}

export class Tape extends Element {

    initial = true;

    componentDidMount() {
        this.vlist.slidingWindowSize = 48;
    }

    // scroll down
    appendElements(index, n) {
        //console.log("A");
        if (index === undefined) index = 0;
        const elements = [];
        for (let i = 0; i < n; ++i, ++index) {
            if (index >= DS.messageCount()) break;
            elements.push(this.renderItem(index));
        }
        this.append(elements);
        return {moreafter: (DS.messageCount() - index)}; // return estimated number of items below this chunk
    }

    // scroll up
    prependElements(index, n) {
        //console.log("P");
        if (index === undefined) index = DS.messageCount() - 1;
        const elements = [];
        for (let i = 0; i < n; ++i, --index) {
            if (index < 0) break;
            elements.push(this.renderItem(index));
        }

        elements.reverse();
        this.prepend(elements);
        this.initial = false;
        return {morebefore: (index <= 0 ? 0 : index + 1)}; // return estimated number of items above this chunk
    }

    // scroll to
    replaceElements(index, n) {
        //console.log("R");
        const elements = [];
        const start = index;
        for (let i = 0; i < n; ++i, ++index) {
            if (index >= DS.messageCount()) break;
            elements.push(this.renderItem(index));
        }

        this.patch(elements);
        return {
            morebefore: (start <= 0 ? 0 : start),
            moreafter: (DS.messageCount() - index),
        }; // return estimated number of items before and above this chunk
    }

    renderItem(index) {
        const item = DS.messageAt(index);
        return <Item key={item.id} genId={this.initial} item={item}/>;
    }

    oncontentrequired(evt) {
        const {length, start, where} = evt.data;
        if (where > 0) // scrolling down, need to append more elements
            evt.data = this.appendElements(start, length);
        else if (where < 0) // scrolling up, need to prepend more elements
            evt.data = this.prependElements(start, length);
        else // scrolling to index
            evt.data = this.replaceElements(start, length);

        return true;
    }
}
