import { h } from 'preact';
import { PopupMessages } from '~/message';
import styled from 'styled-components';

/* -------------------- DOM -------------------- */
type UiProps = {
  className?: string;
  sushiData: PopupMessages['payload'];
  choiceMaterials: string[];
  onMaterialCheckChange: (name: string, checked: boolean) => void;
};

const UiComponent = (props: UiProps) => {
  return (
    <div className={props.className}>
      {Object.keys(props.sushiData.materials).length === 0 ? (
        <div>データがありません</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th />
              {props.sushiData.setMenus.map((menu) => (
                <th>{menu.setName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(props.sushiData.materials)
              .sort((a, b) => (a[1] < b[1] ? 1 : -1))
              .map(([material]) => (
                <tr>
                  <td className="material">
                    <label>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          props.onMaterialCheckChange(material, e.currentTarget.checked);
                        }}
                        checked={props.choiceMaterials.includes(material)}
                      />
                      <span>
                        {material}
                        <span className="single-menu-price">
                          {getPrice(props.sushiData.singleMenus, material)}
                        </span>
                      </span>
                    </label>
                  </td>
                  {props.sushiData.setMenus.map((setMenu) => {
                    const isInclude = setMenu.materials.includes(material);
                    return (
                      <td className={isInclude ? 'available' : 'unavailable'}>
                        {isInclude ? '●' : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const getPrice = (singleMenus: PopupMessages['payload']['singleMenus'], materialName: string) => {
  const singleMenu = singleMenus.find((singleMenu) => singleMenu.materialName === materialName);
  return singleMenu ? `（単品: ${singleMenu.price}）` : '';
};

/* ------------------- Style ------------------- */
const borderStyle = `solid 1px rgb(127 127 127)`;
const StyledUi = styled(UiComponent)`
  table {
    border: ${borderStyle};
    border-collapse: collapse;
  }

  th {
    &:first-child {
      height: 18px;
    }

    padding-left: 10px;
    padding-right: 10px;
    white-space: nowrap;
  }

  th,
  td {
    border: ${borderStyle};
  }

  td {
    &.material {
      min-width: 125px;

      label {
        cursor: pointer;
        display: inline-flex;

        .single-menu-price {
          color: rgb(152 152 152);
        }
      }
    }

    &.unavailable {
      text-align: center;
    }

    &.available {
      font-size: 1.4rem;
      text-align: center;
    }
  }
`;

/*---------------------------------------------- */
export { StyledUi as List };
export type { UiProps as ListProps };
