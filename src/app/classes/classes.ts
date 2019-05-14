export class ClientConfiguration {
    constructor(public serverUrl: string,
        public headersUrl: string,
        public reseedUrl: string,
        public configUrl: string,
        public queryUrl: string) { }
}
export class ServerConfiguration {
    constructor(
        private hostname: string,
        private mysql_port: string,
        private username: string,
        private password: string,
        private database_name: string,
        private table_name: string,
        private replace_null: string,
        private omit_null: string) { }
}

