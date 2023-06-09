import { ReactElement } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../components/home/Home";
import Employee from "../components/Employee/Employee";
import Travel from "../components/Travels/Travel";
import TravelForm from "../components/Travels/Travel_Form";
import PilotsView from "../components/Pilots/Pilots";
import AddPilot from "../components/Pilots/AddPilot";
import UpdatePilot from "../components/Pilots/UpdatePilot";
import AccomodationView from "../components/Accomodation/Accomodation";
import AddClients from "../components/home/AddClient";
import UpdateClient from "../components/home/UpdateClient";
import AddAccommodanion from "../components/Accomodation/AddAccomodation";
import TransportCompanyView from "../components/TransportCompany/TransportCompany";
import AddEmployee from "../components/Employee/AddEmployee";
import TransportyView from "../components/TransportCompany/Transport";
import AddTransportCompany from "../components/TransportCompany/AddTransportCompany";

import AttractionView from "../components/Attraction/Attraction";
import EtapView from "../components/Etap/Etap";
import JourneysView from "../components/Journey/Journey";
import AddEtap from "../components/Etap/AddEtap";
import AddJourney from "../components/Journey/addJourney";
import LangView from "../components/Languages/LangView";
import AddLang from "../components/Languages/AddLang";
import AddAttraction from "../components/Attraction/AddAttraction";
import EditAttraction from "../components/Attraction/UpdateAttraction";
import UpdateEtap from "../components/Etap/UpdateEtap";
import UpdateEmployee from "../components/Employee/UpdateEmployee";
import UpdateJourney from "../components/Journey/updateJourney";
import UpdateTransportCompany from "../components/TransportCompany/UpdateTransportCompany";
import UpdateAccommodation from "../components/Accomodation/UpdateAccomodation";
import AddTransport from "../components/TransportCompany/AddTransport";
import UpdateTransport from "../components/TransportCompany/UpdateTransport";




const IndexRouter: React.FC = (): ReactElement => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<JourneysView />} />
                <Route path={"/klienty"} element={<Home />} />
                <Route path={"/klienty/dodaj"} element={<AddClients />} />
                <Route path={"/klienty/edycja/:pesel"} element={<UpdateClient />} />
                <Route path={"/pracownicy"} element={<Employee />} />
                <Route path={"/pracownicy/dodaj"} element={<AddEmployee />} />
                <Route path={"/pracownicy/edycja/:id"} element={<UpdateEmployee />} />
                <Route path={"/podrozy/dodaniePodrozy"} element={<TravelForm />} />
                <Route path={"/podrozy/edycja/:id"} element={<UpdateJourney />} />
                <Route path={"/przewodnicy"} element={<PilotsView />} />
                <Route path={"/przewodnicy/dodaj"} element={<AddPilot />} />
                <Route path={"/przewodnicy/edycja/:id"} element={<UpdatePilot />} />

                <Route path={"/zakwaterowanie"} element={<AccomodationView />} />
                <Route path={"/zakwaterowanie/dodaj"} element={<AddAccommodanion />} />
                <Route path={"/firma_transportowa"} element={<TransportCompanyView />} />
                <Route path={"/firma_transportowa/edycja/:id"} element={<UpdateTransportCompany />} />
                <Route path={"/firma_transportowa/dodaj"} element={<AddTransportCompany />} />
                <Route path={"/transport"} element={<TransportyView />} />
                <Route path={"/transport/dodaj"} element={<AddTransport />} />
                <Route path={"/transport/edycja/:id"} element={<UpdateTransport />} />
                <Route path={"/zakwaterowanie/edycja/:id"} element={<UpdateAccommodation />} />
                <Route path={"/atrakcje"} element={<AttractionView />} />
                <Route path={"/atrakcje/dodaj"} element={<AddAttraction />} />
                <Route path={"/atrakcje/edycja/:id"} element={<EditAttraction />} />

                <Route path={"/etapy"} element={<EtapView />} />
                <Route path={"/etapy/dodaj"} element={<AddEtap />} />
                <Route path={"/etapy/edycja/:id"} element={<UpdateEtap />} />
                <Route path={"/podrozy"} element={<JourneysView />} />
                <Route path={"/podrozy/dodaj"} element={<AddJourney />} />


                <Route path={"/podrozy"} element={<JourneysView />} />
                <Route path={"/podrozy/dodaj"} element={<AddJourney />} />

                <Route path={"/jezyki"} element={<LangView />} />
                <Route path={"/jezyki/dodaj"} element={<AddLang />} />
            </Routes>
        </BrowserRouter>
    );
};
export default IndexRouter;
