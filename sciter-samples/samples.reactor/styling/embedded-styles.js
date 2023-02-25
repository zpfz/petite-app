
const back = "#000";
const fore = "#FFF";

const styleset = CSS.set`
  :root {
     color: ${fore};
     padding:0.5em 1em 0.5em 3em;
     background: ${back} no-repeat url(images/perfecto.png);
     background-position: top 50% left 0.5em;
     background-size: 2em;
  }

  em {
    color: gold;
  }
`;

export class TestEmb extends Element {
  render() {
    return <div styleset={styleset}>
      Hello <em>Embedded</em> Style Set
    </div>;
  }
}

