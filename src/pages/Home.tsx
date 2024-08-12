import { Share } from "@capacitor/share";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { type Database, Storage } from "@ionic/storage";
import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import iso from "iso-3166-1";

const Home: React.FC = () => {
  const [db, setDb] = useState<Database | null>(null);
  const [visited, setVisited] = useState<string[]>([]);
  const [selected, setSelected] = useState<{
    name: string;
    code: string;
  } | null>(null);

  useEffect(() => {
    async function initDb() {
      const store = new Storage();
      const db = await store.create();

      setDb(db);
    }

    initDb();
  }, []);

  useEffect(() => {
    if (!db) return;

    async function loadVisited() {
      const visited = await db.get("visited");
      setVisited(visited ? JSON.parse(visited) : []);
    }

    loadVisited();
  }, [db]);

  useEffect(() => {
    if (!db) return;

    async function saveVisited() {
      await db.set("visited", JSON.stringify(visited));
    }

    saveVisited();
  }, [db, visited]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>🌏 Have I Been?</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">🌏 Have I Been?</IonTitle>
          </IonToolbar>
        </IonHeader>

        <ComposableMap>
          <ZoomableGroup>
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    fill={
                      visited.includes(geo.properties.name)
                        ? "var(--ion-color-primary)"
                        : "var(--ion-text-color)"
                    }
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      setSelected({
                        name: geo.properties.name,
                        code: geo.id,
                      });
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <h2 className="text-center font-extrabold text-2xl my-3">
          You have visited {visited.length} countries <br /> That's the{" "}
          {Math.round((visited.length / 193) * 100)}%!
        </h2>

        <IonList>
          {visited.map((country) => (
            <IonItem
              key={country}
              onClick={() => {
                setVisited((visited) => visited.filter((v) => v !== country));
              }}
            >
              <IonLabel>{country}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonButton
          className="w-full my-3"
          onClick={() => {
            Share.share({
              title: "Countries I've visited",
              text: `I've visited ${
                visited.length
              } countries! That's the ${Math.round(
                (visited.length / 193) * 100
              )}% of the world! 🌍\n\n${
                visited.length > 0
                  ? visited.map((item) => `- ${item}`).join("\n")
                  : ""
              }`,
            });
          }}
        >
          Share
        </IonButton>

        <IonAlert
          header={selected?.name}
          subHeader="What would you like to do?"
          buttons={[
            {
              text: "✈️",
              handler: () => {
                if (!selected) return;

                const code = iso.whereNumeric(selected.code)?.alpha2;
                if (!code) return;

                window.open(
                  `https://www.skyscanner.it/trasporti/voli/it/${code}/?adultsv2=1&cabinclass=economy&rtn=1&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false`,
                  "_blank"
                );

                setSelected(null);
              },
            },
            visited.includes(selected?.name ?? "")
              ? {
                  text: "❌",
                  role: "confirm",
                  handler: () => {
                    setVisited((visited) =>
                      visited.filter((v) => v !== selected?.name)
                    );
                    setSelected(null);
                  },
                }
              : {
                  text: "✅",
                  role: "confirm",
                  handler: () => {
                    setVisited((visited) => [...visited, selected?.name ?? ""]);
                    setSelected(null);
                  },
                },
          ]}
          isOpen={!!selected}
          onDidDismiss={() => setSelected(null)}
        ></IonAlert>
      </IonContent>
    </IonPage>
  );
};

export default Home;
