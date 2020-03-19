import React, { Component, useState, Fragment } from "react";
import { Form, Checkbox, Accordion, Icon, Menu, Tab } from "semantic-ui-react";
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
          );
        })}
      </Menu>
    </>
  );
  const [accordionActive, setAccordionActive] = useImmer([]);
  const comidasList = Object.entries(foodsByCategory).map(
    ([categoria, foods]) => {
      return (
        //Cada return es un "hijo"
        <Fragment key={categoria}>
          <Accordion.Title
            active={accordionActive.includes(categoria)}
            index={0}
            onClick={() => {
              if (accordionActive.includes(categoria)) {
                setAccordionActive(draft => {
                  draft.splice(draft.indexOf(categoria), 1);
                });
              } else {
                setAccordionActive(draft => {
                  draft.push(categoria);
                });
              }
            }}
          >
            <Icon name="dropdown" />
            {categoria}
          </Accordion.Title>
          <Accordion.Content active={accordionActive.includes(categoria)}>
            <div className="ui middle aligned divided list">
              {foods.map((food, key) => {
                <div className="content active"></div>;
                return (
                  <div className="item" key={key}>
                    <div className="right floated content">
                      <div
                        className="ui button"
                        onClick={() => {
                          if (selectedTable) {
                            setFoodsByTable(oldObject => {
                              const newSelectedTableData = [
                                ...oldObject[selectedTable]
                              ];
                              newSelectedTableData.splice(
                                newSelectedTableData.findIndex(element => {
                                  return element.nombre === food.nombre;
                                }),
                                1
                              );
                              oldObject[selectedTable] = newSelectedTableData;
                              return { ...oldObject };
                            });
                          }
                        }}
                      >
                        Remove
                      </div>
                      <div
                        className="ui button"
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
                      </div>
                    </div>
                    <div className="content">{food.nombre}</div>
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
  }).map(([categoria, pedido]) => {
    return (
      //Cada return es un "hijo"
      <ol className="ui list" key={categoria}>
        {categoria}
        <div className="ui center aligned list">
          {_.sortBy(pedido, value => {
            return prioridadCategorias[value.categoria];
          }).map((pedido, key) => {
            return (
              <div className="ui top attached tabular menu">
                <div className="item" key={key}>
                  <div className="content">{pedido.nombre}</div>
                </div>
              </div>
            );
          })}
        </div>
      </ol>
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
              {pedidos}
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
