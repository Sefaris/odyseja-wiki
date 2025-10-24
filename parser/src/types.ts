/**
 * Interfejs reprezentujący zadanie (quest) z gry
 */
export interface Quest {
  /** Nazwa stałej w kodzie (np. TOPIC_PfeifeMarbod) */
  topicConstant: string;
  /** Polska nazwa zadania widoczna w grze */
  name: string;
  /** Numer rozdziału (kapitel) w którym zadanie występuje */
  chapter?: number;
  /** Nazwa pliku źródłowego LOG_Constants */
  sourceFile: string;
  /** Zleceniodawca - nazwa NPC lub lista nazw itemów */
  questGiver?: string | string[];
  /** ID zleceniodawcy - pełne ID NPC (np. MIL_9000_Harald) lub lista ID itemów */
  questGiverId?: string | string[];
  /** Typ źródła zadania: 'NPC' lub 'ITEM' */
  questSourceType?: "NPC" | "ITEM";
  /** Plik dialogu/itemu gdzie zadanie zostało utworzone */
  dialogFile?: string;
  /** Nagrody za ukończenie questa */
  rewards?: {
    /** Punkty doświadczenia */
    xp?: number;
    /** Złoto */
    gold?: number;
    /** Lista przedmiotów (ID instancji) */
    items?: string[];
  };
}

/**
 * Generyczna instancja obiektu z gry (NPC, Item, itp.)
 */
export interface GameInstance {
  /** Nazwa instancji (np. MIL_9000_Harald, ItPo_Health_01) */
  id: string;
  /** Typ instancji (np. C_Npc, C_ITEM) */
  type: string;
  /** Pola instancji jako klucz-wartość */
  fields: Record<string, string | number>;
  /** Plik źródłowy */
  sourceFile: string;
}

/**
 * Cache wszystkich instancji z gry
 */
export interface InstancesCache {
  /** Mapa: ID instancji -> instancja */
  instances: Map<string, GameInstance>;
  /** Timestamp utworzenia cache */
  timestamp: number;
  /** Wersja cache */
  version: string;
}
