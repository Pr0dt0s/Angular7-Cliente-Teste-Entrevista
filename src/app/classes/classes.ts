export class ClientConfiguration {
    constructor(public serverUrl: string,
        public headersUrl: string,
        public reseedUrl: string,
        public configUrl: string,
        public queryUrl: string) { }
}
export class ServerConfiguration {
    constructor(
        public hostname: string,
        public mysql_port: string,
        public username: string,
        public password: string,
        public database_name: string,
        public table_name: string,
        public replace_null: boolean,
        public omit_null: boolean) { }
}

