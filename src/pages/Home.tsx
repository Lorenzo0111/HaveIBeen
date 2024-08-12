import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { type Database, Storage } from "@ionic/storage";
import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const Home: React.FC = () => {
  const [db, setDb] = useState<Database | null>(null);
  const [visited, setVisited] = useState<string[]>([]);

  useEffect(() => {
    async function initDb() {
      const store = new Storage();
      const db = await store.create();

      setDb(db);
    }

    initDb();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Have I Been?</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Have I Been?</IonTitle>
          </IonToolbar>
        </IonHeader>

        <ComposableMap>
          <Geographies
            onClick={(e) => {
              console.log(e);
            }}
            geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
          >
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  fill="var(--ion-color-primary)"
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={(e) => {
                    console.log(`Clicked on ${geo.properties.name}`);
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </IonContent>
    </IonPage>
  );
};

export default Home;
