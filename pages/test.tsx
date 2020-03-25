import _ from "lodash";
import React, { FC, Fragment, useState } from "react";
import { animateScroll as scroll, Link } from "react-scroll";
import {
  Accordion,
  Button,
  Checkbox,
  Form,
  Grid,
  Header,
  Icon,
  Item,
  ItemContent,
  ItemHeader,
  ListItem,
  Menu,
  Segment,
  Tab,
} from "semantic-ui-react";
import { useImmer } from "use-immer";

import foods from "../src/const/foods.json";
import prioridadCategorias from "../src/const/prioridadCategorias.json";
import tables from "../src/const/tables.json";

function test() {
  const foodsByCategory = foods.reduce<
    Record<string, { nombre: string; categoria: string; precio: number }[]>
  >((acum, value) => {
    if (value.categoria in acum) {
      acum[value.categoria].push(value);
    } else {
      acum[value.categoria] = [value];
    }

    return acum;
  }, {});

  const [selectedTable, setSelectedTable] = useState<string | undefined>();
  const [foodsByTable, setFoodsByTable] = useImmer<
    Record<
      string,
      { nombre: string; precio: number; categoria: string; n: number }[]
    >
  >({});

  const tablesList = (
    <>
      <Menu secondary>
        <Menu.Item name="Mesas" active={true}>
          Mesas
        </Menu.Item>
      </Menu>
      <Menu>
        {tables.map(mesa => {
          return (
            <Fragment key={mesa.nombre}>
              <Menu.Item
                key={mesa.nombre}
                active={selectedTable === mesa.nombre}
                onClick={() => {
                  setSelectedTable(mesa.nombre);
                  if (!(mesa.nombre in foodsByTable)) {
                    setFoodsByTable(draft => {
                      draft[mesa.nombre] = [];
                    });
                  }
                  //Aqui agregar lo de foods a table
                }}
              >
                {mesa.nombre}
              </Menu.Item>
            </Fragment>
          );
        })}
      </Menu>
    </>
  );
  const [FoodAccordionActive, setFoodAccordionActive] = useImmer([]);
  const comidasList = Object.entries(foodsByCategory).map(
    ([categoria, foods]) => {
      return (
        //Cada return es un "hijo"
        <Fragment key={categoria}>
          <Accordion.Title
            active={FoodAccordionActive.includes(categoria)}
            index={0}
            onClick={() => {
              if (FoodAccordionActive.includes(categoria)) {
                setFoodAccordionActive(draft => {
                  draft.splice(draft.indexOf(categoria), 1);
                });
              } else {
                setFoodAccordionActive(draft => {
                  draft.push(categoria);
                });
              }
            }}
          >
            <Icon name="dropdown" />
            {categoria}
          </Accordion.Title>
          <Accordion.Content active={FoodAccordionActive.includes(categoria)}>
            <div className="ui middle aligned list">
              {foods.map((food, key) => {
                return (
                  <div className="item" key={key}>
                    <div style={{ float: "right" }}>
                      <Button
                        className="mini ui"
                        onClick={() => {
                          if (selectedTable) {
                            setFoodsByTable(draft => {
                              const foundFood = draft[selectedTable].find(
                                value => food.nombre === value.nombre
                              );
                              if (foundFood) {
                                foundFood.n += 1;
                              } else {
                                draft[selectedTable].push({ ...food, n: 1 });
                              }
                            });
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="content" style={{ float: "left" }}>
                      {food.nombre}
                    </div>
                  </div>
                );
              })}
            </div>
          </Accordion.Content>
        </Fragment>
      );
    }
  );

  const pedidos = _.sortBy(Object.entries(foodsByTable), value => {
    return value[0];
  }).map(([table, pedido]) => {
    return (
      <>
        <Item>
          <ol className="ui list" key={table}>
            <Fragment key={table}>
              <ItemHeader>{table}</ItemHeader>
              <ItemContent>
                <div className="ui center aligned list">
                  {_.sortBy(pedido, value => {
                    return prioridadCategorias[value.categoria];
                  }).map((pedido, key) => {
                    return (
                      <div
                        className="content"
                        style={{
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ float: "left" }}>{pedido.nombre}</div>
                        <div style={{ float: "left" }}>{pedido.n}</div>

                        <div style={{ float: "right" }}>
                          ${pedido.precio * pedido.n}{" "}
                          <Button //Boton de eliminacion de pedido
                            className="mini ui"
                            onClick={() => {
                              if (table) {
                                setFoodsByTable(draft => {
                                  const foundFood = draft[table].find(
                                    value => pedido.nombre === value.nombre
                                  );

                                  const foundFoodIndex = draft[table].findIndex(
                                    value => pedido.nombre === value.nombre
                                  );

                                  if (foundFood) {
                                    foundFood.n -= 1;
                                    if (foundFood.n === 0) {
                                      draft[table].splice(foundFoodIndex, 1);
                                    }
                                  }
                                });
                              }
                            }}
                          >
                            -
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ItemContent>
            </Fragment>
          </ol>
        </Item>
      </>
    );
  });

  console.log(JSON.stringify(Object.entries(foodsByTable), null, 2));
  //Lo que se muestra

  return (
    <>
      <Segment>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            {tablesList}
            <>
              <Header styled="fluid">Pedidos:</Header>
              <Segment attached="bottom">{pedidos}</Segment>
            </>
          </Grid.Column>

          <Grid.Column>
            <Accordion fluid styled>
              {comidasList}
            </Accordion>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

export default test;
