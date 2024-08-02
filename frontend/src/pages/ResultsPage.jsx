import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table, Row, Col, Card } from "react-bootstrap";

import { PieChart } from "../components/charts";
import { round } from "../utils/misc";
import { AccordionInstillinger } from "../components/Accordion";
import "../index.css";

import { sortNodesByType } from "../utils/nodes";
import { getEmptyReturnArray } from "../utils/misc";
import {
  getVarmetapstallDirekte,
  getVarmetapstallUoppvarmetSone,
  getVarmetapstallVentilasjon,
  getVarmetapstallInfiltrasjon,
  getVarmetapstallMotGrund,
  getVarmetapPerMåned,
} from "../calculations/varmetap";
import {
  getVarmetilskuddSol,
  getVarmetilskuddInternlast,
  getVarmetilskuddVifter,
} from "../calculations/varmetilskudd";
import {
  getEnergibehovInternlaster,
  getEnergibehovKjøling,
  getEnergibehovPumper,
  getEnergibehovVent,
  getEnergibehovRomoppvarming,
} from "../calculations/teknisk";

const initialVarmetapstall = {
  total: {
    Yttervegger: 0,
    Yttertak: 0,
    Gulv: 0,
    "Vinduer Og Dører": 0,
    Kuldebroer: 0,
    Infiltrasjon: 0,
    Ventilasjon: 0,
  },
};

const initialNettoEnergibehov = {
  total: {
    "1 Romoppvarming": 0,
    "2 Varmtvann": 0,
    "3a Vifter": 0,
    "3b Pumper": 0,
    "4 Belysning": 0,
    "5 Teknisk Utstyr": 0,
    "6 Kjøling": 0,
  },
};

const ResultsPage = () => {
  const projectHierarchy = useSelector((state) => state.project);
  const sortedNodes = sortNodesByType(projectHierarchy);

  const [selectedSones, setSelectedSones] = useState(sortedNodes.sone);
  const [varmetapstall, setVarmetapstall] = useState(initialVarmetapstall);
  const [nettoEnergibehov, setNettoEnergibehov] = useState(initialNettoEnergibehov);

  const bygningskategori = projectHierarchy.data.bygningskategori.value;

  const totalAreal = useMemo(() => {
    return sortedNodes.sone.reduce((acc, sone) => {
      return acc + Number(sone.data.oppvarmetBRA.value);
    }, 0);
  }, [sortedNodes]);

  useEffect(() => {
    const newVarmetapstall = {};
    const newNettoEnergibehov = {};

    selectedSones.forEach((sone) => {
      const key = sone.key;

      /**
       * beregn normalisert varmetapsbudsjett for sonen [kW/(Km2)] fordelt på poster i NS 3031 Tabell 4
       */
      const calculateVarmetapstall = (sone) => {
        const varmetapstallSone = getVarmetapstallDirekte(sortedNodes, sone.key);
        varmetapstallSone.uoppvarmetSone = getVarmetapstallUoppvarmetSone(sortedNodes, sone.key);
        varmetapstallSone.ventilasjon = getVarmetapstallVentilasjon(sortedNodes, sone.key);
        varmetapstallSone.infiltrasjon = getVarmetapstallInfiltrasjon(sone);
        varmetapstallSone.gulv = getVarmetapstallMotGrund(sortedNodes, sone.key);

        // normaliser varmetapstall til oppvarmet bruksareal
        for (const key in varmetapstallSone) {
          varmetapstallSone[key] = round(varmetapstallSone[key] / totalAreal);
        }

        console.log(`Varmetapstall for sone ${sone.key}: `, varmetapstallSone);
        return varmetapstallSone;
      };

      /**
       * beregn varmetilskudd og varmetap [kWh] per måned for sonen
       */
      const calculateVarmetilskudd = (sone) => {
        const varmetilskuddSone = {
          internlast: getVarmetilskuddInternlast(bygningskategori, sortedNodes, key),
          ventilasjon: getVarmetilskuddVifter(bygningskategori, sortedNodes, key),
          sol: getVarmetilskuddSol(projectHierarchy, sortedNodes, key),
        };

        // rundt av varmetilskudd til 2 desimaler og summer varmetilskudd for hver måned
        varmetilskuddSone.total = getEmptyReturnArray("varmetilskudd");
        for (const varmekilde in varmetilskuddSone) {
          varmetilskuddSone[varmekilde].forEach((month, idx) => {
            month.varmetilskudd = round(month.varmetilskudd);
            varmetilskuddSone.total[idx].varmetilskudd += month.varmetilskudd;
          });
        }

        console.log(`varmetilskudd for sone ${sone.key}: `, varmetilskuddSone);
        return varmetilskuddSone;
      };

      // hent månedlig varmetap [kWh] og rund av til 2 desimaler
      const calucluateVarmetap = (sone, varmetapstallSone) => {
        const varmetapSone = getVarmetapPerMåned(sone, varmetapstallSone);
        varmetapSone.forEach((entry) => {
          entry.varmetap = round(entry.varmetap);
        });

        console.log(`varmetap for sone ${sone.key}: `, varmetapSone);
        return varmetapSone;
      };

      /**
       * Beregner årlig netto energibehov for sonen fordelt på poster i NS 3031 Tabell 5.
       *
       * @param {Object} varmetapSone - Varmetapet for sonen.
       * @param {Object} varmetilskuddSone - Varmetilskuddet for sonen.
       * @returns {Object} - Beregnet energibehov for sonen.
       */
      const calculateNettoEnergibehov = (varmetapSone, varmetilskuddSone) => {
        const energibehovSone = {
          oppvarming: getEnergibehovRomoppvarming(sone.data, varmetapSone, varmetilskuddSone.total),
          kjøling: getEnergibehovKjøling(sone.data, varmetapSone),
          vifter: getEnergibehovVent(sone),
        };

        energibehovSone.pumper = getEnergibehovPumper(
          sone,
          energibehovSone.oppvarming,
          energibehovSone.kjøling
        );

        const { belysning, utstyr, varmtvann } = getEnergibehovInternlaster(sone);
        energibehovSone.belysning = belysning;
        energibehovSone.utstyr = utstyr;
        energibehovSone.varmtvann = varmtvann;

        console.log("energibehovSone: ", energibehovSone);

        return energibehovSone;
      };

      const varmetapstallSone = calculateVarmetapstall(sone);
      const varmetilskuddSone = calculateVarmetilskudd(sone);
      const varmetapSone = calucluateVarmetap(sone, varmetapstallSone);
      const energibehovSone = calculateNettoEnergibehov(varmetapSone, varmetilskuddSone);

      newVarmetapstall[key] = varmetapstallSone;
      newNettoEnergibehov[key] = energibehovSone;
    });

    setVarmetapstall(newVarmetapstall);
    setNettoEnergibehov(newNettoEnergibehov);
  }, [projectHierarchy, selectedSones]);

  const varmetapstallTotal = useMemo(() => {
    return Object.values(varmetapstall).reduce(
      (total, sone) => ({
        Yttervegger: total.Yttervegger + sone.fasader,
        Yttertak: total.Yttertak + sone.tak,
        Gulv: total.Gulv + sone.gulv,
        "Vinduer Og Dører": total["Vinduer Og Dører"] + sone.vinduerOgDører,
        Kuldebroer: total.Kuldebroer + sone.kuldebro,
        Infiltrasjon: total.Infiltrasjon + sone.infiltrasjon,
        Ventilasjon: total.Ventilasjon + sone.ventilasjon,
      }),
      {
        Yttervegger: 0,
        Yttertak: 0,
        Gulv: 0,
        "Vinduer Og Dører": 0,
        Kuldebroer: 0,
        Infiltrasjon: 0,
        Ventilasjon: 0,
      }
    );
  }, [varmetapstall]);

  const nettoEnergibehovTotal = useMemo(() => {
    return Object.values(nettoEnergibehov).reduce(
      (total, sone) => ({
        "1 Romoppvarming": total["1 Romoppvarming"] + sone.oppvarming,
        "2 Varmtvann": total["2 Varmtvann"] + sone.varmtvann,
        "3a Vifter": total["3a Vifter"] + sone.vifter,
        "3b Pumper": total["3b Pumper"] + sone.pumper,
        "4 Belysning": total["4 Belysning"] + sone.belysning,
        "5 Teknisk Utstyr": total["5 Teknisk Utstyr"] + sone.utstyr,
        "6 Kjøling": total["6 Kjøling"] + sone.kjøling,
      }),
      {
        "1 Romoppvarming": 0,
        "2 Varmtvann": 0,
        "3a Vifter": 0,
        "3b Pumper": 0,
        "4 Belysning": 0,
        "5 Teknisk Utstyr": 0,
        "6 Kjøling": 0,
      }
    );
  }, [nettoEnergibehov]);

  return (
    <>
      <div className="container ">
        <AccordionInstillinger
          selectedSones={selectedSones}
          setSelectedSones={setSelectedSones}
          allSones={sortedNodes.sone}
        />
        <Row>
          {/* Varmetapstall */}
          <Col lg={6} className="mb-3 mb-md-0">
            <Card>
              <Card.Header className="card-form-heading">
                <h4 className="card-title">Varmetapstall [W/(m2·K)]</h4>
              </Card.Header>
              <Card.Body>
                <PieChart data={varmetapstallTotal} />
                <Table bordered hover size="sm" responsive>
                  <thead>
                    {/* Overskrifter */}
                    <tr>
                      <th>Post</th>
                      <th>Varmetapstall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(varmetapstallTotal).map(([key, value]) => (
                      <tr key={key} className="form-group-sm">
                        <td className="col-6">{key}</td>
                        <td className="col-6">{round(value, 2)}</td>
                      </tr>
                    ))}
                    <tr className="form-group-sm">
                      <td className="col-6">Totalt</td>
                      <td className="col-6">
                        {round(
                          Object.values(varmetapstallTotal).reduce((acc, num) => acc + num, 0),
                          2
                        )}
                      </td>
                    </tr>
                    <tr></tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          {/* Energibehov */}
          <Col lg={6}>
            <Card>
              <Card.Header>
                <h4 className="card-title">Energibehov [kWh]</h4>
              </Card.Header>
              <Card.Body>
                <PieChart data={nettoEnergibehovTotal} />
                <Table bordered hover size="sm" responsive>
                  <thead>
                    <tr>
                      <th className="col-4">Post</th>
                      <th className="col-3">Energibehov</th>
                      <th className="col-5">Spesifikt Energibehov</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(nettoEnergibehovTotal).map(([key, value]) => (
                      <tr key={key} className="form-group-sm">
                        <td className="col-4">{key}</td>
                        <td className="col-3">{round(value, 0)}</td>
                        <td className="col-5">{round(value / totalAreal, 1)}</td>
                      </tr>
                    ))}
                    <tr className="form-group-sm">
                      <td className="col-4">Totalt</td>
                      <td className="col-3">
                        {round(
                          Object.values(nettoEnergibehovTotal).reduce((acc, num) => acc + num, 0),
                          0
                        )}
                      </td>
                      <td className="col-5">
                        {round(
                          Object.values(nettoEnergibehovTotal).reduce((acc, num) => acc + num, 0) /
                            totalAreal,
                          1
                        )}
                      </td>
                    </tr>
                    <tr></tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ResultsPage;
