use crate::{
    accommodation::ZakwaterowanieBasic,
    attraction::AtrakcjaBasic,
    client::KlientBasic,
    etap::EtapBasic,
    pilot::{PilotBasic, PilotDeleteQuery},
    urls::RequestBody,
    utils::get_postgres_client,
    views::{Response, ResponseArray},
    worker::WorkerBasic,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozBasic {
    pub id: i64,
    pub nazwa: String,
    pub cena: i64,
    pub data_rozpoczecia: String,
    pub data_ukonczenia: String,
    pub opis: String,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct Podroz {
    pub key: i64,
    pub id: i64,
    pub nazwa: String,
    pub cena: i64,
    pub data_rozpoczecia: String,
    pub data_ukonczenia: String,
    pub opis: String,
    pub zysk:i64,
    pub atrakcje: Vec<AtrakcjaBasic>,
    pub etapy: Vec<EtapBasic>,
    pub klienci: Vec<KlientBasic>,
    pub zakwaterowania: Vec<ZakwaterowanieBasic>,
    pub pracownicy: Vec<WorkerBasic>,
    pub przewodnicy: Vec<PilotBasic>,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozInsert {
    pub nazwa: String,
    pub cena: i64,
    pub data_rozpoczecia: String,
    pub data_ukonczenia: String,
    pub opis: String,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozAttractionQuery {
    pub podroz_id: i64,
    pub atrakcja_id: i64,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozPilotQuery {
    pub podroz_id: i64,
    pub przewodnik_id: i64,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozKlientQuery {
    pub podroz_id: i64,
    pub klient_pesel: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozPracownikQuery {
    pub podroz_id: i64,
    pub pracownik_id: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozEtapQuery {
    pub podroz_id: i64,
    pub etap_id: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozZakwaterowanieQuery {
    pub podroz_id: i64,
    pub zakwaterowanie_id: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozDelete {
    pub id: i64,
}
#[derive(Serialize, Deserialize, Debug)]
pub struct PodrozQuery {
    pub id_list: Vec<i64>,
    pub from: String,
    pub to: String,

}
pub fn get_all_journey_json<'a>() -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: ResponseArray<Podroz> = ResponseArray {
            status: 200,
            message: "OK".to_owned(),
            result: connection
                .query(
                        "select p.id,p.nazwa, cast(p.data_rozpoczecia as varchar), cast(p.data_ukonczenia as varchar), p.opis, p.cena, 
przewodnik ,
klient ,
atrakcja ,
pracownik ,
etap ,
zakwaterowanie,
zysk_z_podrozy(p.id)
                        from podroz p
						left join lateral (
    						select COALESCE(json_agg(prz)::text,'[]')  as przewodnik
    						from przewodnik prz left join przewodnik_podroz pp on pp.przewodnik_id = prz.id
    						where pp.podroz_id = p.id
    					) pr on true
						left join lateral (
    						select  COALESCE(json_agg(kl)::text,'[]')   as klient
    						from klient kl left join klient_podroz pp on pp.klient_pesel = kl.pesel
    						where pp.podroz_id = p.id
    					) kl on true
						left join lateral (
    						select  COALESCE(json_agg(att)::text,'[]')   as atrakcja
    						from atrakcja att left join podroz_atrakcja pp on pp.atrakcja_id = att.id
    						where pp.podroz_id = p.id
    					) att on true
						left join lateral (
    						select  COALESCE(json_agg(prac)::text,'[]')   as pracownik
    						from pracownik prac left join pracownik_podroz pp on pp.pracownik_id = prac.id
    						where pp.podroz_id = p.id
    					) prac on true
						left join lateral (
    						select  COALESCE(json_agg(et)::text,'[]')   as etap
    						from etap et left join etap_podroz pp on pp.etap_id = et.id
    						where pp.podroz_id = p.id
    					) et on true
						left join lateral (
    						select   COALESCE(json_agg(et)::text,'[]')   as zakwaterowanie
    						from zakwaterowanie et left join zakwaterowanie_podroz pp on pp.zakwaterowanie_id = et.id
    						where pp.podroz_id = p.id
    					) zak on true
                        group by p.id,p.nazwa,p.data_rozpoczecia,p.data_ukonczenia, p.opis, p.cena,przewodnik ,
klient ,
atrakcja ,
pracownik ,
etap ,
zakwaterowanie order by p.data_rozpoczecia",
                    &[],
                )
                .unwrap()
                .iter()
                .map(|row| Podroz {
                    key: row.get(0),
                    id: row.get(0),
                    nazwa: row.get(1),
                    data_rozpoczecia: row.get(2),
                    data_ukonczenia: row.get(3),
                    opis: row.get(4),
                    cena: row.get(5),
                    zysk: row.get(12),
                    przewodnicy: serde_json::from_str::<Vec<PilotBasic>>(row.get(6))
                        .unwrap_or(Vec::new()),
                    klienci: serde_json::from_str::<Vec<KlientBasic>>(row.get(7))
                        .unwrap_or(Vec::new()),
                    atrakcje: serde_json::from_str::<Vec<AtrakcjaBasic>>(row.get(8))
                        .unwrap_or(Vec::new()),
                    pracownicy: serde_json::from_str::<Vec<WorkerBasic>>(row.get(9))
                        .unwrap_or(Vec::new()),
                    etapy: serde_json::from_str::<Vec<EtapBasic>>(row.get(10))
                        .unwrap_or(Vec::new()),
                    zakwaterowania: serde_json::from_str::<Vec<ZakwaterowanieBasic>>(row.get(11))
                        .unwrap_or(Vec::new()),
                })
                .collect::<Vec<Podroz>>(),
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

pub fn get_certain_journeys_json<'a>(params: RequestBody<PodrozQuery>) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    let params_query: Vec<String> = params
        .params
        .id_list
        .iter()
        .map(|v| v.to_string())
        .collect();
    let mut query: String = "select p.id,p.nazwa, cast(p.data_rozpoczecia as varchar), cast(p.data_ukonczenia as varchar), p.opis, p.cena, 
przewodnik ,
klient ,
atrakcja ,
pracownik ,
etap ,
zakwaterowanie,
zysk_z_podrozy(p.id)
                        from podroz p
												left join lateral (
    						select COALESCE(json_agg(prz)::text,'[]')  as przewodnik
    						from przewodnik prz left join przewodnik_podroz pp on pp.przewodnik_id = prz.id
    						where pp.podroz_id = p.id
    					) pr on true
						left join lateral (
    						select  COALESCE(json_agg(kl)::text,'[]')   as klient
    						from klient kl left join klient_podroz pp on pp.klient_pesel = kl.pesel
    						where pp.podroz_id = p.id
    					) kl on true
						left join lateral (
    						select  COALESCE(json_agg(att)::text,'[]')   as atrakcja
    						from atrakcja att left join podroz_atrakcja pp on pp.atrakcja_id = att.id
    						where pp.podroz_id = p.id
    					) att on true
						left join lateral (
    						select  COALESCE(json_agg(prac)::text,'[]')   as pracownik
    						from pracownik prac left join pracownik_podroz pp on pp.pracownik_id = prac.id
    						where pp.podroz_id = p.id
    					) prac on true
						left join lateral (
    						select  COALESCE(json_agg(et)::text,'[]')   as etap
    						from etap et left join etap_podroz pp on pp.etap_id = et.id
    						where pp.podroz_id = p.id
    					) et on true
						left join lateral (
    						select   COALESCE(json_agg(et)::text,'[]')   as zakwaterowanie
    						from zakwaterowanie et left join zakwaterowanie_podroz pp on pp.zakwaterowanie_id = et.id
    						where pp.podroz_id = p.id
    					) zak on true ".to_owned();
    if (!params.params.from.is_empty() && !params.params.to.is_empty())
        || !params.params.id_list.is_empty()
    {
        query.push_str(" where ")
    }
    if !params.params.id_list.is_empty() {
        query.push_str(" p.id in (");
        query.push_str(params_query.join(",").as_str());
        query.push_str(") or ");
    }

    if !params.params.from.is_empty() && !params.params.to.is_empty() {
        query.push_str(" (p.data_rozpoczecia<= TO_DATE($1,'DD-MM-YYYY') and p.data_ukonczenia >= TO_DATE($2,'DD-MM-YYYY')) ");
    } else {
        query.push_str(" (false and $1=$2 )");
    }

    query.push_str(
        " group by p.id,p.nazwa,p.data_rozpoczecia,p.data_ukonczenia, p.opis, p.cena,przewodnik ,
klient ,
atrakcja ,
pracownik ,
etap ,
zakwaterowanie order by p.data_rozpoczecia desc",
    );
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: ResponseArray<Podroz> = ResponseArray {
            status: 200,
            message: "OK".to_owned(),
            result: connection
                .query(&query, &[&params.params.from,&params.params.to])
                .unwrap()
                .iter()
                .map(|row| Podroz {
                    key: row.get(0),
                    id: row.get(0),
                    nazwa: row.get(1),
                    data_rozpoczecia: row.get(2),
                    data_ukonczenia: row.get(3),
                    opis: row.get(4),
                    cena: row.get(5),
                    zysk: row.get(12),
                    przewodnicy: serde_json::from_str::<Vec<PilotBasic>>(row.get(6))
                        .unwrap_or(Vec::new()),
                    klienci: serde_json::from_str::<Vec<KlientBasic>>(row.get(7))
                        .unwrap_or(Vec::new()),
                    atrakcje: serde_json::from_str::<Vec<AtrakcjaBasic>>(row.get(8))
                        .unwrap_or(Vec::new()),
                    pracownicy: serde_json::from_str::<Vec<WorkerBasic>>(row.get(9))
                        .unwrap_or(Vec::new()),
                    etapy: serde_json::from_str::<Vec<EtapBasic>>(row.get(10))
                        .unwrap_or(Vec::new()),
                    zakwaterowania: serde_json::from_str::<Vec<ZakwaterowanieBasic>>(row.get(11))
                        .unwrap_or(Vec::new()),
                })
                .collect::<Vec<Podroz>>(),
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

pub fn insert_certain_journey_json<'a>(
    params: RequestBody<PodrozInsert>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<i64>;

        let mut query_result: Vec<PilotDeleteQuery> = match connection.query(

            "INSERT INTO podroz (nazwa, data_rozpoczecia, data_ukonczenia, opis, cena) values ($1,TO_DATE($2,'DD-MM-YYYY'),TO_DATE($3,'DD-MM-YYYY'),$4,$5) returning id",

           

                &[
                    &params.params.nazwa,
                    &params.params.data_rozpoczecia,
                    &params.params.data_ukonczenia,
                    &params.params.opis,
                    &params.params.cena,
                ],
        ) {
            Ok(result) => result
                .iter()
                .map(|row| PilotDeleteQuery { id: row.get(0) })
                .collect::<Vec<PilotDeleteQuery>>(),
            Err(result) => {println!("{}",result);  Vec::new()},
        };

        if query_result
            .get(0)
            //.unwrap()
            .unwrap_or(&PilotDeleteQuery { id: 0 })
            .id
            > 0
        {
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
                message: "Cannot add new journey".to_owned(),
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

pub fn update_certain_journey_json<'a>(
    params: RequestBody<PodrozBasic>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        connection
                .execute("delete from podroz_atrakcja where podroz_id=$1", &[&params.params.id])
                .unwrap();
        connection
                .execute("delete from pracownik_podroz where podroz_id=$1", &[&params.params.id])
                .unwrap();
connection
                .execute("delete from przewodnik_podroz where podroz_id=$1", &[&params.params.id])
                .unwrap(); 
connection
                .execute("delete from etap_podroz where podroz_id=$1", &[&params.params.id])
                .unwrap(); 
                connection
                .execute("delete from zakwaterowanie_podroz where podroz_id=$1", &[&params.params.id])
                .unwrap(); 
        let result: Response<u64> = Response {
            status: 200,
            message: "OK".to_owned(),
            result: connection
                .execute("UPDATE podroz SET nazwa=$2, data_rozpoczecia=TO_DATE($3,'DD-MM-YYYY'),data_ukonczenia=TO_DATE($4,'DD-MM-YYYY'),opis=$5,cena=$6 where id=$1", &[&params.params.id,&params.params.nazwa,&params.params.data_rozpoczecia,&params.params.data_ukonczenia,&params.params.opis,&params.params.cena])
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
pub fn delete_certain_journey_json<'a>(
    params: RequestBody<PodrozDelete>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        connection
            .execute(
                "Delete from przewodnik_podroz where podroz_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);
        connection
            .execute(
                "Delete from klient_podroz where podroz_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);
        connection
            .execute(
                "Delete from podroz_atrakcja where podroz_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);
        connection
            .execute(
                "Delete from pracownik_podroz where podroz_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);
        connection
            .execute(
                "Delete from etap_podroz where podroz_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);
        connection
            .execute(
                "Delete from zakwaterowanie_podroz where podroz_id=$1",
                &[&params.params.id],
            )
            .unwrap_or(0);
        let query_result = connection
            .execute("Delete from podroz where id=$1", &[&params.params.id])
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "Podroz zostala usuniety".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Nie mozna usunac podrozy".to_owned(),
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

pub fn add_attraction_to_journey_json<'a>(
    params: RequestBody<PodrozAttractionQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        if connection
            .query(
                "select * from atrakcja where id=$1",
                &[&params.params.atrakcja_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id atrakcji nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        if connection
            .query(
                "select * from podroz where id=$1",
                &[&params.params.podroz_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id podrozy nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "insert into podroz_atrakcja (atrakcja_id, podroz_id) values ($1,$2)",
                &[&params.params.atrakcja_id, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas dodwania powiazania".to_owned(),
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

pub fn remove_attraction_from_journey_json<'a>(
    params: RequestBody<PodrozAttractionQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "DELETE from podroz_atrakcja where podroz_id=$1 and atrakcja_id=$2",
                &[&params.params.podroz_id, &params.params.atrakcja_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas usuwania powiazania".to_owned(),
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

pub fn add_pilot_to_journey_json<'a>(
    params: RequestBody<PodrozPilotQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        if connection
            .query(
                "select * from przewodnik where id=$1",
                &[&params.params.przewodnik_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id przewodnika nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        if connection
            .query(
                "select * from podroz where id=$1",
                &[&params.params.podroz_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id podrozy nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "insert into przewodnik_podroz (przewodnik_id, podroz_id) values ($1,$2)",
                &[&params.params.przewodnik_id, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas dodwania powiazania".to_owned(),
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

pub fn remove_pilot_from_journey_json<'a>(
    params: RequestBody<PodrozPilotQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "DELETE from przewodnik_podroz where podroz_id=$1 and przewodnik_id=$2",
                &[&params.params.podroz_id, &params.params.przewodnik_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas usuwania powiazania".to_owned(),
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
pub fn add_client_to_journey_json<'a>(
    params: RequestBody<PodrozKlientQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        if connection
            .query(
                "select * from klient where pesel=$1",
                &[&params.params.klient_pesel],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Pesel nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        if connection
            .query(
                "select * from podroz where id=$1",
                &[&params.params.podroz_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id podrozy nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "insert into klient_podroz (klient_pesel, podroz_id) values ($1,$2)",
                &[&params.params.klient_pesel, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas dodwania powiazania".to_owned(),
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

pub fn remove_client_from_journey_json<'a>(
    params: RequestBody<PodrozKlientQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "DELETE from klient_podroz where podroz_id=$1 and klient_pesel=$2",
                &[&params.params.podroz_id, &params.params.klient_pesel],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas usuwania powiazania".to_owned(),
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

pub fn add_worker_to_journey_json<'a>(
    params: RequestBody<PodrozPracownikQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        if connection
            .query(
                "select * from pracownik where id=$1",
                &[&params.params.pracownik_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id pracownika nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        if connection
            .query(
                "select * from podroz where id=$1",
                &[&params.params.podroz_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id podrozy nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "insert into pracownik_podroz (pracownik_id, podroz_id) values ($1,$2)",
                &[&params.params.pracownik_id, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas dodwania powiazania".to_owned(),
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

pub fn remove_worker_from_journey_json<'a>(
    params: RequestBody<PodrozPracownikQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "DELETE from pracownik_podroz where podroz_id=$1 and pracownik_id=$2",
                &[&params.params.podroz_id, &params.params.pracownik_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas usuwania powiazania".to_owned(),
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

pub fn add_etap_to_journey_json<'a>(
    params: RequestBody<PodrozEtapQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        if connection
            .query("select * from etap where id=$1", &[&params.params.etap_id])
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id etapu nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        if connection
            .query(
                "select * from podroz where id=$1",
                &[&params.params.podroz_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id podrozy nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "insert into etap_podroz (etap_id, podroz_id) values ($1,$2)",
                &[&params.params.etap_id, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas dodwania powiazania".to_owned(),
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

pub fn remove_etap_from_journey_json<'a>(
    params: RequestBody<PodrozEtapQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "DELETE from etap_podroz where etap_id=$1 and podroz_id=$2",
                &[&params.params.etap_id, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas usuwania powiazania".to_owned(),
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

pub fn add_accommodation_to_journey_json<'a>(
    params: RequestBody<PodrozZakwaterowanieQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        if connection
            .query(
                "select * from zakwaterowanie where id=$1",
                &[&params.params.zakwaterowanie_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id zakwaterowania nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        if connection
            .query(
                "select * from podroz where id=$1",
                &[&params.params.podroz_id],
            )
            .unwrap()
            .len()
            != 1
        {
            return HashMap::from([
                ("Status", "500 Internal Server Error".to_owned()),
                (
                    "Content",
                    "{result:'Id podrozy nie jest jednoznaczne'}".to_owned(),
                ),
                ("Content-Type", "application/json".to_owned()),
            ]);
        }
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "insert into zakwaterowanie_podroz (zakwaterowanie_id, podroz_id) values ($1,$2)",
                &[&params.params.zakwaterowanie_id, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas dodwania powiazania".to_owned(),
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

pub fn remove_accommodation_from_journey_json<'a>(
    params: RequestBody<PodrozZakwaterowanieQuery>,
) -> HashMap<&'a str, String> {
    let client = get_postgres_client();
    if client.is_ok() {
        let mut connection = client.unwrap();
        let result: Response<u64>;
        let query_result = connection
            .execute(
                "DELETE from zakwaterowanie_podroz where zakwaterowanie_id=$1 and podroz_id=$2",
                &[&params.params.zakwaterowanie_id, &params.params.podroz_id],
            )
            .unwrap_or(0);
        if query_result > 0 {
            result = Response {
                status: 200,
                message: "OK".to_owned(),
                result: query_result,
            };
        } else {
            result = Response {
                status: 500,
                message: "Wystapil blad podczas usuwania powiazania".to_owned(),
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
