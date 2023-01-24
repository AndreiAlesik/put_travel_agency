use crate::{
    pilot::PilotDeleteQuery,
    transport::{TransportBasic, TransportInsert},
    urls::RequestBody,
    utils::get_postgres_client,
    views::{Response, ResponseArray},
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct Etap {
    pub key: i64,
    pub id: i64,
    pub punkt_poczatkowy: String,
    pub punkt_konczowy: String,
    pub koszt: i64,
    pub data_poczatkowa: String,
    pub data_koncowa: String,
    pub transport: TransportBasic,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct EtapBasic {
    pub id: i64,
    pub punkt_poczatkowy: String,
    pub punkt_konczowy: String,
    pub koszt: i64,
    pub data_poczatkowa: String,
    pub data_koncowa: String,
    pub transport: TransportBasic,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct EtapInsert {
    pub punkt_poczatkowy: String,
    pub punkt_konczowy: String,
    pub koszt: i64,
    pub data_poczatkowa: String,
    pub data_koncowa: String,
    pub transport: TransportInsert,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct EtapDelete {
    pub id: i64,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct EtapQuery {
    pub id_list: Vec<i64>,
}
//
pub fn get_all_etap_json<'a>() -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: ResponseArray<Etap> = ResponseArray {
            status: 200,
            message: "OK".to_owned(),
            result: connection
                .query(
                    "select e.id, e.id, e.punkt_poczatkowy, e.punkt_konczowy, e.koszt, cast( e.data_poczatkowa as varchar),cast( e.data_koncowa as varchar),json_agg(t)::text from etap e
                        join transport t on t.id = e.id
                        group by e.id, e.punkt_poczatkowy, e.punkt_konczowy, e.koszt,e.data_poczatkowa,e.data_koncowa",
                    &[],
                )
                .unwrap()
                .iter()
                .map(|row| Etap {
                    id: row.get(0),
                    key: row.get(1),
                    punkt_poczatkowy: row.get(2),
                    punkt_konczowy: row.get(3),
                    koszt: row.get(4),
                    data_poczatkowa: row.get(5),
                    data_koncowa: row.get(6),
                    transport: serde_json::from_str::<TransportBasic>(row.get(7))
                        .unwrap_or(TransportBasic {                    key: row.get(0),                            id: row.get(0), nazwa: "".to_string(), liczba_jednostek: 0, liczba_miejsc:0 }),
                })
                .collect::<Vec<Etap>>(),
        };
        connection.close();
        return HashMap::from([
            ("Status", "200 OK".to_owned()),
            (
                "Content",
                serde_json::to_string(&result).unwrap().to_owned(),
            ),
            ("Content-Type", "application/json".to_owned()),
        ]);
    } else {
        println!("ERROR: Cannot connet to database!");
        return HashMap::from([
            ("Status", "401 PERMISSION DENIED".to_owned()),
            ("Content", "{result:'PERMISSION DENIED'}".to_owned()),
            ("Content-Type", "application/json".to_owned()),
        ]);
    }
}

pub fn get_certain_etap_json<'a>(params: RequestBody<EtapQuery>) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    let params_query: Vec<String> = params
        .params
        .id_list
        .iter()
        .map(|v| v.to_string())
        .collect();
    let mut query: String = "select e.id, e.id, e.punkt_poczatkowy, e.punkt_konczowy, e.koszt,e.data_poczatkowa,e.data_koncowa,json_agg(t) from etap e
            join transport t on t.id = e.id  e.id in (".to_owned();
    query.push_str(params_query.join(",").as_str());
    query.push_str(") group by e.id, e.punkt_poczatkowy, e.punkt_konczowy, e.koszt,e.data_poczatkowa,e.data_koncowa");
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: ResponseArray<Etap> = ResponseArray {
            status: 200,
            message: "OK".to_owned(),
            result: connection
                .query(&query, &[])
                .unwrap()
                .iter()
                .map(|row| Etap {
                    key: row.get(0),
                    id: row.get(0),
                    punkt_poczatkowy: row.get(1),
                    punkt_konczowy: row.get(2),
                    koszt: row.get(3),
                    data_poczatkowa: row.get(4),
                    data_koncowa: row.get(5),
                    transport: serde_json::from_str::<TransportBasic>(row.get(6)).unwrap_or(
                        TransportBasic {
                            key: row.get(0),
                            id: row.get(0),
                            nazwa: "".to_string(),
                            liczba_jednostek: 0,
                            liczba_miejsc: 0,
                        },
                    ),
                })
                .collect::<Vec<Etap>>(),
        };
        connection.close();
        return HashMap::from([
            ("Status", "200 OK".to_owned()),
            (
                "Content",
                serde_json::to_string(&result).unwrap().to_owned(),
            ),
            ("Content-Type", "application/json".to_owned()),
        ]);
    } else {
        println!("ERROR: Cannot connet to database!");
        return HashMap::from([
            ("Status", "401 PERMISSION DENIED".to_owned()),
            ("Content", "{result:'PERMISSION DENIED'}".to_owned()),
            ("Content-Type", "application/json".to_owned()),
        ]);
    }
}

pub fn insert_certain_etap_json<'a>(params: RequestBody<EtapInsert>) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<i64>;
        let mut query_result: Vec<PilotDeleteQuery> = match connection.query(
            "INSERT INTO etap (punkt_poczatkowy, punkt_konczowy,koszt,data_poczatkowa,data_koncowa) values ($1,$2,$3,TO_DATE($4,'DD-MM-YYYY'),TO_DATE($5,'DD-MM-YYYY')) returning id",
                &[
                    &params.params.punkt_poczatkowy,
                    &params.params.punkt_konczowy,
                    &params.params.koszt,
                    &params.params.data_poczatkowa,
                    &params.params.data_koncowa,
                ],        ) {
            Ok(result) => result
                .iter()
                .map(|row| PilotDeleteQuery { id: row.get(0) })
                .collect::<Vec<PilotDeleteQuery>>(),
            Err(result) => Vec::new(),
        };

        if query_result
            .get(0)
            .unwrap_or(&PilotDeleteQuery { id: 0 })
            .id
            > 0
        {
            connection.execute(
                    "INSERT INTO transport (nazwa, liczba_jednostek,liczba_miejsc) values ($1,$2,$3,$4) returning id",
                &[
                    &query_result
            .get(0)
            .unwrap_or(&PilotDeleteQuery { id: 0 })
            .id
,
                    &params.params.transport.nazwa,
                    &params.params.transport.liczba_jednostek,
                    &params.params.transport.liczba_miejsc,
                ],
            );
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result
                    .get(0)
                    .unwrap_or(&PilotDeleteQuery { id: 0 })
                    .id,
            };
        } else {
            result = Response {
                status: 500,
                message: "Cannot add new accommodation".to_owned(),
                result: 0,
            };
        }

        let mut response = HashMap::from([
            (
                "Content",
                serde_json::to_string(&result).unwrap().to_owned(),
            ),
            ("Content-Type", "application/json".to_owned()),
        ]);
        if result.status == 200 {
            response.extend([("Status", "200 OK".to_owned())]);
        } else {
            response.extend([("Status", "500 Internal Server Error".to_owned())]);
        }
        connection.close();
        return response;
    } else {
        println!("ERROR: Cannot connect to database!");
        return HashMap::from([
            ("Status", "401 PERMISSION DENIED".to_owned()),
            ("Content", "{result:'PERMISSION DENIED'}".to_owned()),
            ("Content-Type", "application/json".to_owned()),
        ]);
    }
}
pub fn update_certain_etap_json<'a>(params: RequestBody<EtapBasic>) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64> = Response {
            status: 200,
            message: "OK".to_owned(),
            result: connection
                .execute("UPDATE Etap SET punkt_poczatkowy=$2, punkt_konczowy=$3, koszt=$4, data_poczatkowa=TO_DATE($5,'DD-MM-YYYY'), data_koncowa=TO_DATE($6,'DD-MM-YYYY') where id=$1", &[&params.params.id,&params.params.punkt_poczatkowy,&params.params.punkt_konczowy,&params.params.koszt,&params.params.data_poczatkowa,&params.params.data_koncowa])
                .unwrap()
        };
        connection.close();
        return HashMap::from([
            ("Status", "200 OK".to_owned()),
            (
                "Content",
                serde_json::to_string(&result).unwrap().to_owned(),
            ),
            ("Content-Type", "application/json".to_owned()),
        ]);
    } else {
        println!("ERROR: Cannot connet to database!");
        return HashMap::from([
            ("Status", "401 PERMISSION DENIED".to_owned()),
            ("Content", "{result:'PERMISSION DENIED'}".to_owned()),
            ("Content-Type", "application/json".to_owned()),
        ]);
    }
}
pub fn delete_certain_etap_json<'a>(params: RequestBody<EtapDelete>) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        connection
            .execute(
                "Delete from etap_podroz where etap_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);
        connection
            .execute(
                "Delete from transport_firma_transportowa where transport_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);

        connection
            .execute("Delete from etap where id=$1", &[&params.params.id])
            .unwrap_or(0);
        let query_result = connection
            .execute("Delete from transport where id=$1", &[&params.params.id])
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "Etap zostal usuniety".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Nie mozna usunac etapu".to_owned(),
                result: query_result,
            };
        }
        let mut response = HashMap::from([
            (
                "Content",
                serde_json::to_string(&result).unwrap().to_owned(),
            ),
            ("Content-Type", "application/json".to_owned()),
        ]);
        if result.status == 200 {
            response.extend([("Status", "200 OK".to_owned())]);
        } else {
            response.extend([("Status", "500 Internal Server Error".to_owned())]);
        }
        connection.close();
        return response;
    } else {
        println!("ERROR: Cannot connet to database!");
        return HashMap::from([
            ("Status", "401 PERMISSION DENIED".to_owned()),
            ("Content", "{result:'PERMISSION DENIED'}".to_owned()),
            ("Content-Type", "application/json".to_owned()),
        ]);
    }
}
