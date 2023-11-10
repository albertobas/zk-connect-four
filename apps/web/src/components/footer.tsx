import styles from './footer.module.css';

export function Footer(): JSX.Element {
  return (
    <div className={styles.footer}>
      <p>
        Visit this{' '}
        <a
          href="https://www.albertobas.com/blog/how-to-build-zero-knowledge-dapp"
          rel="nofollow noreferrer noopener"
          target="_blank"
          title="How to build a zero-knowledge dapp - Alberto Bas"
        >
          link
        </a>{' '}
        for more information.
      </p>
      <a
        href="https://www.albertobas.com"
        rel="nofollow noreferrer noopener"
        target="_blank"
        title="Alberto Bas - www.albertobas.com"
      >
        <svg
          className={styles.logo}
          version="1.1"
          viewBox="0 0 16 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(318.97 -95.838)">
            <path
              d="m-314.97 95.839a4.0001 3.9997 0 0 0-3.997 3.9998 4.0001 3.9997 0 0 0 4.0001 3.9998 4.0001 3.9997 0 0 0 2.4001-0.79996c0.36431 0.48468 0.94428 0.79734 1.6 0.79734v-3.9971a4.0001 3.9997 0 0 0-0.0101-0.2875 4.0001 3.9997 0 0 0-9.6e-4 -0.02131 4.0001 3.9997 0 0 0-0.0302-0.26767 4.0001 3.9997 0 0 0-4e-3 -0.02861 4.0001 3.9997 0 0 0-0.0532-0.28123 4.0001 3.9997 0 0 0-9.6e-4 -0.0048 4.0001 3.9997 0 0 0-0.0713-0.26925 4.0001 3.9997 0 0 0-8e-3 -0.02486 4.0001 3.9997 0 0 0-0.0886-0.25417 4.0001 3.9997 0 0 0-0.0126-0.03024 4.0001 3.9997 0 0 0-0.11202-0.25833 4.0001 3.9997 0 0 0-3e-3 -0.0048 4.0001 3.9997 0 0 0-0.13594-0.2583 4.0001 3.9997 0 0 0-5e-3 -0.0077 4.0001 3.9997 0 0 0-0.14843-0.238 4.0001 3.9997 0 0 0-0.0136-0.01882 4.0001 3.9997 0 0 0-0.16773-0.22864 4.0001 3.9997 0 0 0-5.1e-4 -5.18e-4 4.0001 3.9997 0 0 0-0.18386-0.21561 4.0001 3.9997 0 0 0-0.0146-0.01613 4.0001 3.9997 0 0 0-5.2e-4 -5.09e-4 4.0001 3.9997 0 0 0-0.20364-0.20468 4.0001 3.9997 0 0 0-4e-3 -0.0038 4.0001 3.9997 0 0 0-0.22137-0.19166 4.0001 3.9997 0 0 0-4e-3 -0.0019 4.0001 3.9997 0 0 0-0.23438-0.17448 4.0001 3.9997 0 0 0-6e-3 -0.0038 4.0001 3.9997 0 0 0-0.23177-0.14738 4.0001 3.9997 0 0 0-0.0239-0.01411 4.0001 3.9997 0 0 0-0.51409-0.2505 4.0001 3.9997 0 0 0-0.0256-0.01008 4.0001 3.9997 0 0 0-0.26512-0.09427 4.0001 3.9997 0 0 0-8e-3 -0.0019 4.0001 3.9997 0 0 0-0.85419-0.16769 4.0001 3.9997 0 0 0-0.0219-0.0021 4.0001 3.9997 0 0 0-0.27449-0.01197 4.0001 3.9997 0 0 0-0.0146-5.21e-4 4.0001 3.9997 0 0 0-0.0203 0 4.0001 3.9997 0 0 0-6e-3 0 3.0001 2.9998 0 0 0-3e-3 0zm4.0032 3.9998a4.0001 3.9997 0 0 0 0.0113 0.29738 4.0001 3.9997 0 0 0 0.0146 0.13125 4.0001 3.9997 0 0 0 0.0188 0.16509 4.0001 3.9997 0 0 0 5.2e-4 3e-3 4.0001 3.9997 0 0 0 0.0557 0.29374 4.0001 3.9997 0 0 0 0.0761 0.28591 4.0001 3.9997 0 0 0 0.0375 0.10734 4.0001 3.9997 0 0 0 0.062 0.17654 4.0001 3.9997 0 0 0 0.0166 0.0386 4.0001 3.9997 0 0 0 0.10368 0.23696 4.0001 3.9997 0 0 0 0.13854 0.26247 4.0001 3.9997 0 0 0 0.0261 0.0417 4.0001 3.9997 0 0 0 0.13438 0.21354 4.0001 3.9997 0 0 0 0.17606 0.23851 4.0001 3.9997 0 0 0 0.0469 0.0547 4.0001 3.9997 0 0 0 0.14635 0.17083 4.0001 3.9997 0 0 0 0.099 0.0995 4.0001 3.9997 0 0 0 0.10886 0.10885 4.0001 3.9997 0 0 0 0.11249 0.0979 4.0001 3.9997 0 0 0 0.11719 0.10002 4.0001 3.9997 0 0 0 0.11036 0.0823 4.0001 3.9997 0 0 0 0.12497 0.0927 4.0001 3.9997 0 0 0 0.12864 0.0818 4.0001 3.9997 0 0 0 0.12814 0.0803 4.0001 3.9997 0 0 0 0.10936 0.0583 4.0001 3.9997 0 0 0 0.1526 0.0803 4.0001 3.9997 0 0 0 0.12032 0.0537 4.0001 3.9997 0 0 0 0.15417 0.0678 4.0001 3.9997 0 0 0 0.15 0.0532 4.0001 3.9997 0 0 0 0.12605 0.0442 4.0001 3.9997 0 0 0 0.16979 0.0464 4.0001 3.9997 0 0 0 0.12184 0.0323 4.0001 3.9997 0 0 0 0.14012 0.0276 4.0001 3.9997 0 0 0 0.15416 0.0292 4.0001 3.9997 0 0 0 0.14324 0.0171 4.0001 3.9997 0 0 0 0.15155 0.0171 4.0001 3.9997 0 0 0 0.14794 6e-3 4.0001 3.9997 0 0 0 0.1375 6e-3 4.0001 3.9997 0 0 0 0.0202 0 4.0001 3.9997 0 0 0 6e-3 0 4.0001 3.9997 0 0 0 0.0183-5.3e-4 3.0001 2.9998 0 0 0 0.0703-9.6e-4 4.0001 3.9997 0 0 0 3.9116-3.9982 4.0001 3.9997 0 0 0-4.0001-3.9998 4.0001 3.9997 0 0 0-2.398 0.80202c-0.36419-0.4862-0.94519-0.79942-1.6021-0.79942zm-4.0001-1.9999a2.0001 1.9999 0 0 1 0.20887 0.01133 2.0001 1.9999 0 0 1 5e-3 5.09e-4 2.0001 1.9999 0 0 1 0.1974 0.03178 2.0001 1.9999 0 0 1 8e-3 9.6e-4 2.0001 1.9999 0 0 1 0.19948 0.05318 2.0001 1.9999 0 0 1 5.3e-4 0 2.0001 1.9999 0 0 1 0.18905 0.07286 2.0001 1.9999 0 0 1 0.0101 0.0038 2.0001 1.9999 0 0 1 0.17606 0.09015 2.0001 1.9999 0 0 1 0.0113 0.0058 2.0001 1.9999 0 0 1 0.16198 0.10468 2.0001 1.9999 0 0 1 0.0161 0.01258 2.0001 1.9999 0 0 1 0.14895 0.12031 2.0001 1.9999 0 0 1 0.013 0.01258 2.0001 1.9999 0 0 1 0.13803 0.13801 2.0001 1.9999 0 0 1 6e-3 0.0077 2.0001 1.9999 0 0 1 0.12234 0.15103 2.0001 1.9999 0 0 1 0.0126 0.01661 2.0001 1.9999 0 0 1 0.10053 0.15467 2.0001 1.9999 0 0 1 0.0146 0.02563 2.0001 1.9999 0 0 1 0.0854 0.16873 2.0001 1.9999 0 0 1 4e-3 0.0086 2.0001 1.9999 0 0 1 0.0707 0.18437 2.0001 1.9999 0 0 1 5e-3 0.01613 2.0001 1.9999 0 0 1 0.0505 0.18956 2.0001 1.9999 0 0 1 9.6e-4 0.0077 2.0001 1.9999 0 0 1 0.0323 0.20052 2.0001 1.9999 0 0 1 0 0.0048 2.0001 1.9999 0 0 1 0.0113 0.20574 2.0001 1.9999 0 0 1-2.0001 1.9999 2.0001 1.9999 0 0 1-0.11452-6e-3 2.0001 1.9999 0 0 1-0.10256-6e-3 2.0001 1.9999 0 0 1-0.1057-0.0171 2.0001 1.9999 0 0 1-0.0984-0.0161 2.0001 1.9999 0 0 1-0.12081-0.0323 2.0001 1.9999 0 0 1-0.0808-0.0219 2.0001 1.9999 0 0 1-0.0959-0.037 2.0001 1.9999 0 0 1-0.28595-0.13435 2.0001 1.9999 0 0 1-0.0661-0.0427 2.0001 1.9999 0 0 1-0.27917-0.21144 2.0001 1.9999 0 0 1-0.13856-0.1396 2.0001 1.9999 0 0 1-0.13281-0.16454 2.0001 1.9999 0 0 1-0.20573-0.35728 2.0001 1.9999 0 0 1-9.6e-4 -3e-3 2.0001 1.9999 0 0 1-0.038-0.10001 2.0001 1.9999 0 0 1-0.0364-0.0948 2.0001 1.9999 0 0 1-0.0537-0.20104 2.0001 1.9999 0 0 1-5.3e-4 -9.6e-4 2.0001 1.9999 0 0 1-0.0204-0.12862 2.0001 1.9999 0 0 1-0.0126-0.0776 2.0001 1.9999 0 0 1-0.0113-0.20779 2.0001 1.9999 0 0 1 0.0113-0.20885 2.0001 1.9999 0 0 1 0.0869-0.40935 2.0001 1.9999 0 0 1 0.28385-0.55725 2.0001 1.9999 0 0 1 0.28023-0.31094 2.0001 1.9999 0 0 1 0.16249-0.13175 2.0001 1.9999 0 0 1 0.75939-0.338 2.0001 1.9999 0 0 1 5.3e-4 0 2.0001 1.9999 0 0 1 0.20678-0.03283 2.0001 1.9999 0 0 1 0.20886-0.01133zm8.0002 0a2.0001 1.9999 0 0 1 0.2052 0.01133 2.0001 1.9999 0 0 1 4e-3 0 2.0001 1.9999 0 0 1 3e-3 5.09e-4 2.0001 1.9999 0 0 1 0.20314 0.03226 2.0001 1.9999 0 0 1 5.2e-4 0 2.0001 1.9999 0 0 1 5.3e-4 0 2.0001 1.9999 0 0 1 0.20051 0.05367 2.0001 1.9999 0 0 1 3e-3 9.6e-4 2.0001 1.9999 0 0 1 0.18647 0.07133 2.0001 1.9999 0 0 1 0.013 0.0058 2.0001 1.9999 0 0 1 5e-3 0.0029 2.0001 1.9999 0 0 1 0.17032 0.08688 2.0001 1.9999 0 0 1 9e-3 0.0048 2.0001 1.9999 0 0 1 0.16198 0.10519 2.0001 1.9999 0 0 1 0.0161 0.01133 2.0001 1.9999 0 0 1 9.6e-4 9.6e-4 2.0001 1.9999 0 0 1 0.15208 0.12347 2.0001 1.9999 0 0 1 9e-3 0.0086 2.0001 1.9999 0 0 1 0.14011 0.14061 2.0001 1.9999 0 0 1 6e-3 0.0077 2.0001 1.9999 0 0 1 0.12233 0.15103 2.0001 1.9999 0 0 1 8e-3 0.01133 2.0001 1.9999 0 0 1 0.10622 0.16353 2.0001 1.9999 0 0 1 8e-3 0.01258 2.0001 1.9999 0 0 1 0.0906 0.17916 2.0001 1.9999 0 0 1 3e-3 0.0058 2.0001 1.9999 0 0 1 0.0734 0.19113 2.0001 1.9999 0 0 1 9.6e-4 0.0038 2.0001 1.9999 0 0 1 0.0532 0.19945 2.0001 1.9999 0 0 1 5.2e-4 9.6e-4 2.0001 1.9999 0 0 1 0.0317 0.20364 2.0001 1.9999 0 0 1 5.2e-4 0.0029 2.0001 1.9999 0 0 1 0.0113 0.2078 2.0001 1.9999 0 0 1-0.17291 0.81348 2.0001 1.9999 0 0 1-0.20886 0.36196 2.0001 1.9999 0 0 1-0.44272 0.44269 2.0001 1.9999 0 0 1-0.362 0.20883 2.0001 1.9999 0 0 1-0.60469 0.16197 2.0001 1.9999 0 0 1-0.20886 0.0113 2.0001 1.9999 0 0 1-0.81357-0.17291 2.0001 1.9999 0 0 1-0.36199-0.20883 2.0001 1.9999 0 0 1-0.82451-1.6181 2.0001 1.9999 0 0 1 2.0001-1.9999z"
              strokeWidth=".2329"
            />
          </g>
        </svg>
      </a>
    </div>
  );
}
