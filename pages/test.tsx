import React, { Component, useState, Fragment } from "react";
import {
  Form,
  Checkbox,
  Accordion,
  Icon,
  Menu,
  Tab,
  ListItem,
  Button,
  Item,
  ItemHeader,
  ItemContent
} from "semantic-ui-react";
import foods from "../src/const/foods.json";
import tables from "../src/const/tables.json";
import { useImmer } from "use-immer";
import _ from "lodash";
import { Link, animateScroll as scroll } from "react-scroll";
import prioridadCategorias from "../src/const/prioridadCategorias.json";

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
  const [foodsByTable, setFoodsByTable] = useState<
    Record<string, { nombre: string; precio: number; categoria: string }[]>
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
                    setFoodsByTable(oldObject => {
                      oldObject[mesa.nombre] = [];
                      return oldObject;
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
                            setFoodsByTable(oldObject => {
                              oldObject[selectedTable] = [
                                ...oldObject[selectedTable],
                                food
                              ];
                              return { ...oldObject };
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

  /*const [foodsByPedido] = {foodsByCategory.map((value, index) => {
    return  
  })*/
  //duda
  const [PedidoAccordionActive, setPedidoAccordionActive] = useImmer([]);
  const pedidos = _.sortBy(Object.entries(foodsByTable), value => {
    return value[0];
  }).map(([table, pedido]) => {
    return (
      <>
        <Item>
          <ol className="ui list" key={table}>
            <Fragment key={table}>
              <ItemHeader
                active={PedidoAccordionActive.includes(table)}
                index={0}
                onClick={() => {
                  if (PedidoAccordionActive.includes(table)) {
                    setPedidoAccordionActive(draft => {
                      draft.splice(draft.indexOf(table), 1);
                    });
                  } else {
                    setPedidoAccordionActive(draft => {
                      draft.push(table);
                    });
                  }
                }}
              >
                {table}
              </ItemHeader>
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

                        <div style={{ float: "right" }}>
                          ${pedido.precio}{" "}
                          <Button //Boton de eliminacion de pedido
                            className="mini ui"
                            onClick={() => {
                              if (selectedTable) {
                                setFoodsByTable(oldObject => {
                                  const newSelectedTableData = [
                                    ...oldObject[selectedTable]
                                  ];
                                  newSelectedTableData.splice(
                                    newSelectedTableData.findIndex(element => {
                                      return element.nombre === pedido.nombre;
                                    }),
                                    1
                                  );
                                  oldObject[
                                    selectedTable
                                  ] = newSelectedTableData;
                                  return { ...oldObject };
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

  return (
    <div className="ui segment">
      <div className="ui two column very relaxed grid">
        <div className="column">
          {tablesList}
          <div>
            <div className="ui top attached tabular menu">
              <div className="active item">Pedidos:</div>
            </div>
            <div className="ui bottom attached active tab segment">
              <div className="content">{pedidos}</div>
            </div>
          </div>
        </div>

        <div className="column">
          <Accordion fluid styled>
            {comidasList}
          </Accordion>
        </div>
        <div className="ui vertical divider"></div>
      </div>
    </div>
  );
}

export default test;
