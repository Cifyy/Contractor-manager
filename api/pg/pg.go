package pg

import (
	"context"
	"log"
	"sync"

	"github.com/jackc/pgx/v5/pgxpool"
)

type postgres struct {
	DB *pgxpool.Pool
}

var (
	PgInstance *postgres
	pgOnce     sync.Once
)

func NewPG(ctx context.Context, Host string, Port uint16, User string, Password string, Database string) (*postgres, error) {

	config, err := pgxpool.ParseConfig("")
	if err != nil {
		log.Fatalf("unable to parse DATABASE_URL: %v", err)
	}
	config.ConnConfig.Config.Host = Host
	config.ConnConfig.Config.Port = Port
	config.ConnConfig.Config.User = User
	config.ConnConfig.Config.Password = Password
	config.ConnConfig.Config.Database = Database
	config.ConnConfig.TLSConfig = nil

	pgOnce.Do(func() {
		// db, err := pgxpool.New(ctx, config.ConnString())
		db, err := pgxpool.NewWithConfig(ctx, config)
		if err != nil {
			log.Fatalf("unable to create connection pool: %v", err)
		}

		PgInstance = &postgres{db}
	})
	return PgInstance, nil
}

func (pg *postgres) Ping(ctx context.Context) error {
	return pg.DB.Ping(ctx)
}

func (pg *postgres) Close() {
	pg.DB.Close()
}
