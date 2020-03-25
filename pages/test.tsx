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
  ItemContent,
  Segment,
  Grid,
  Header
} from "semantic-ui-react";
import foods from "../src/const/foods.json";
import tables from "../src/const/tables.json";
import { useImmer } from "use-immer";
import _ from "lodash";
import { Link, animateScroll as scroll } from "react-scroll";
import prioridadCategorias from "../src/const/prioridadCategorias.json";
import { type } from "os";
import { writeHeapSnapshot } from "v8";

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
  })
  const foodsByPedido = foods.entries();*/
  //duda

  //Parte pedidos
  /*function diccionaryForMesa() {
    this.datastore = [];
    this.add = function(key, value) {
      if (key && value) {
        this.datastore.push({
          key: key,
          value: value

        });
      }
      return this.datastore;
    };
    this.removeAt = function(key) {
      for (var i = 0; i < this.datastore.length; i++) {
        if (this.datastore[i].key == key) {
          this.datastore.splice(this.datasotre[i], 1);
          return this.datastore;
        }
      }
    };
    this.search = function(key) {
      for (var i = 0; i < this.datastore.length; i++) {
        if (this.datastore[i].key == key) {
          return true;
        }
      }
      return false;
    };
  }
  function diccionaryforPedido() {
    this.datastore = [];
    this.add = function(key, value) {
      if (key && value) {
        this.datastore.push({
          key: key,
          value: value

        });
      }
      return this.datastore;
    };
    this.removeAt = function(key) {
      for (var i = 0; i < this.datastore.length; i++) {
        if (this.datastore[i].key == key) {
          this.datastore.splice(this.datasotre[i], 1);
          return this.datastore;
        }
      }
    };
    this.search = function(key) {
      for (var i = 0; i < this.datastore.length; i++) {
        if (this.datastore[i].key == key) {
          return true;
        }
      }
      return false;
    };
  }
  let foodsByPedido = new diccionaryForMesa();
  if (foodsByPedido.search(key)){

  }
  else{
    foodsByPedido.add(key, (pedidos=new diccionaryforPedido()))
  }*/
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

  //Lo que se muestra
  return (
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
        <div className="ui vertical divider"></div>
      </Grid>
    </Segment>
  );
}

export default test;
