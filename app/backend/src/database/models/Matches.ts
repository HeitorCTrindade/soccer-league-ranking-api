import { Model, DataTypes } from 'sequelize';
import Teams from './Teams';
import db from '.';

class Matches extends Model {
  declare id: number;
  homeTeamId!: number;
  declare homeTeamGoals: number;
  awayTeamId!: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Matches.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    homeTeamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    homeTeamGoals: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    awayTeamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    awayTeamGoals: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    inProgress: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
  },
  {
    underscored: true,
    sequelize: db,
    modelName: 'matches',
    timestamps: false,
  },
);

Matches.belongsTo(Teams, {
  foreignKey: 'homeTeamId',
  as: 'homeTeam',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Matches.belongsTo(Teams, {
  foreignKey: 'awayTeamId',
  as: 'awayTeam',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Teams.hasMany(Matches, {
  foreignKey: 'homeTeamId',
  as: 'homeTeam',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Teams.hasMany(Matches, {
  foreignKey: 'awayTeamId',
  as: 'awayTeam',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default Matches;
