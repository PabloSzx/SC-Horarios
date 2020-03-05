import React, { Component, useState } from "react";
import { Form, Checkbox } from "semantic-ui-react";
import foods from "../src/const/foods.json";
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
  const [foodsByTable, setFoodsByTable] = useState<
    Record<string, { nombre: string; precio: number; categoria: string }[]>
  >({});

  const tablesList = (
    <>
      <div>
        <div className="ui top attached tabular menu">
          <div className="active item">Mesas</div>
        </div>
        <div className="ui bottom attached active tab segment">
          <div className="ui buttons">
            {tables.map(mesa => {
              return (
                <div
                  className={
                    selectedTable === mesa.nombre
                      ? "ui button active"
                      : "ui button"
                  }
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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  const comidasList = Object.entries(foodsByCategory).map(
    ([categoria, foods]) => {
      return (
        //Cada return es un "hijo"
        <ol className="ui list" key={categoria}>
          <li>
            {categoria}
            <div className="ui middle aligned divided list">
              {foods.map((food, key) => {
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
          </li>
        </ol>
      );
    }
  );
  /*const pedidos = Object.entries(foodsByTable.map(
    ([categoria, cantidad, comidaEnPedido]) => {
      return(
        if(selectedTable){

        }
      )
    }
  )*/

  return (
    <div>
      {tablesList}
      <div>
        <div className="ui top attached tabular menu">
          <div className="active item">
            Pedidos
            {JSON.stringify(foodsByTable)}
          </div>
        </div>
        <div className="ui bottom attached active tab segment">
          <p></p>
          <p></p>
        </div>
      </div>
      {comidasList}
    </div>
  );
}
/*function test2() {
  const [value, setValue] = useState("this");

  const handleChange = (e, { value }) => setValue(value);

  return (
    <>
      <div>
        <div className="ui top attached tabular menu">
          <div className="active item">Mesas</div>
        </div>
        <div className="ui bottom attached active tab segment">
          <div className="ui buttons">
            <button className="ui button">Mesa 1</button>
            <button className="ui button">Mesa 2</button>
            <button className="ui button">Mesa 3</button>
            <button className="ui button">Mesa 4</button>
            <button className="ui button">Mesa 5</button>
            <button className="ui button">Mesa 6</button>
            <button className="ui button">Mesa 7</button>
          </div>
        </div>
      </div>
      <div>
        <div className="ui top attached tabular menu">
          <div className="active item">Pedidos</div>
        </div>
        <div className="ui bottom attached active tab segment">
          <p></p>
          <p></p>
        </div>
      </div>
      <h2>
        <ol className="ui list">
          <li value="*">
            Principales
            <div className="ui middle aligned divided list">
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Confit Pato</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Risotto Camarones</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Raviol Zapallo</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Sorrentino Berenjena</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Filete Roquefort</div>
              </div>
            </div>
          </li>
          <li value="*">
            Pizza
            <div className="ui middle aligned divided list">
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 1</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 2</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 3</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 4</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 5</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 6</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 7</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 8</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza 9</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Pizza Peperronni</div>
              </div>
            </div>
          </li>
          <li value="*">
            Bebestibles
            <div className="ui middle aligned divided list">
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Bebidas</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Jugo</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Aperitivo</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Cerveza</div>
              </div>
            </div>
          </li>
          <li value="*">
            Postres
            <div className="ui middle aligned divided list">
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Brownie</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Creme Bruleé</div>
              </div>
              <div className="item">
                <div className="right floated content">
                  <div className="ui button">Add</div>
                </div>
                <div className="content">Tarte tatin</div>
              </div>
            </div>
          </li>
        </ol>
      </h2>
    </>
  );
}*/
export default test;
